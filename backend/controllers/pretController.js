const Pret = require("../models/Pret");

async function createPret(req, res) {
  try {
    const pret = new Pret(req.body);
    await pret.save();
    res.status(201).json(pret);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function returnPret(req, res) {
  try {
    const pret = await Pret.findById(req.params.id);
    if (!pret) {
      return res.status(404).json({ message: "Prêt non trouvé" });
    }

    pret.dateRetourEffective = new Date();
    pret.statutPret = "retourné";
    await pret.save();

    res.json(pret);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function extendPret(req, res) {
  try {
    const pret = await Pret.findById(req.params.id);
    if (!pret) {
      return res.status(404).json({ message: "Prêt non trouvé" });
    }

    if (pret.statutPret !== "en cours") {
      return res.status(400).json({ message: "Impossible de prolonger ce prêt" });
    }

    pret.dateRetourPrevue = new Date(pret.dateRetourPrevue.getTime() + 7 * 24 * 60 * 60 * 1000);
    await pret.save();

    res.json(pret);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserPrets(req, res) {
  try {
    const userId = req.params.userId || req.user.id; // لو ما مررنا userId نأخذ من التوكن
    const prets = await Pret.find({ utilisateur: userId })
      .populate("utilisateur", "nom prenom")
      .populate("exemplaire")
      .populate("employe", "nom prenom");
    res.json(prets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getOverduePrets(req, res) {
  try {
    const now = new Date();
    const overduePrets = await Pret.find({
      statutPret: "en cours",
      dateRetourPrevue: { $lt: now },
    })
      .populate("utilisateur", "nom prenom")
      .populate("exemplaire")
      .populate("employe", "nom prenom");

    res.json(overduePrets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createPret,
  returnPret,
  extendPret,
  getUserPrets,
  getOverduePrets,
};
