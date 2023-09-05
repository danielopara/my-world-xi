const express = require("express");
const mongoose = require("mongoose");
const XI = require("../modules/xiModel");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const playersCount = await XI.countDocuments();

    if (playersCount >= 11) {
      return res.status(400).json({
        message: "Number of players reached",
      });
    }
  } catch (err) {
    console.log(err);
  }

  const xi = new XI({
    _id: new mongoose.Types.ObjectId(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    player_number: req.body.player_number,
    position: req.body.position,
    foot: req.body.foot,
  });
  xi.save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Added Player successfully",
        player: {
          name: result.first_name + " " + result.last_name,
          number: result.player_number,
          position: result.position,
          more_details: {
            type: "GET",
            url: "http://localhost:2020/xi",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "player not added",
        error: err.message,
      });
    });
});

router.get("/", (req, res, next) => {
  XI.find()
    .select("first_name last_name player_number position")
    .exec()
    .then((result) => {
      result.sort((a, b) => {
        const positions = ["GoalKeeper", "Defender", "Midfielder", "Forward"];
        return positions.indexOf(a.position) - positions.indexOf(b.position);
      });

      console.log(result);

      const response = {
        "total players": result.length,
        list: result.map((player) => {
          return {
            _id: player._id,
            showName: player.first_name + " " + player.last_name,
            firstName: player.first_name,
            lastName: player.last_name,
            number: player.player_number,
            position: player.position,
            getPlayer: {
              url: "https://daniel-worldxi.onrender.com/xi/" + player._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    });
});

router.put("/:playerId/updatePosition", (req, res, next) => {
  const playerId = req.params.playerId.toString();
  const position = req.body.position;
  console.log(position, playerId);

  XI.findByIdAndUpdate(playerId, { position: position })
    .exec()
    .then((updatedPlayer) => {
      if (!updatedPlayer) {
        return res
          .status(404)
          .json({ message: "Player not found", other: updatedPlayer });
      }

      res.status(200).json({
        message: "Player position updated",
        updatedPlayer: {
          id: updatedPlayer._id,
          firstName: updatedPlayer.first_name,
          lastName: updatedPlayer.last_name,
          position: position,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  XI.findById(id)
    .select(" first_name last_name position player_number foot")
    .exec()
    .then((result) => {
      if (result) {
        const response = {
          "Full name": result.first_name + " " + result.last_name,
          position: result.position,
          number: result.player_number,
          foot: result.foot,
          "All players": {
            url: "http://localhost:2020/xi",
          },
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "ID does not exist",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err.message,
      });
    });
});

module.exports = router;
