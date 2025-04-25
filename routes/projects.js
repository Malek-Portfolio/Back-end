const express = require("express");

const router = express.Router();

const Projects = require("../models/project");

//Getting all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Projects.find(
      {},
      {
        thumbnail: 1,
        title: 1,
        description: 1,
        link: 1,
        type: 1,
        category: 1,
        slug: 1,
      }
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const projects = await Projects.findOne(
      { slug: slug },
      {
        thumbnail: 1,
        title: 1,
        description: 1,
        link: 1,
        type: 1,
        category: 1,
        slug: 1,
        features: 1,
        technologies: 1,
      }
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// adding a project
router.post("/", async (req, res) => {
  const project = new Projects({
    title: req.body.title,
    description: req.body.description,
    thumbnail: req.body.thumbnail,
    gallery: req.body.gallery,
    category: req.body.category,
    link: req.body.link,
    type: req.body.type,
  });

  try {
    const newProject = await project.save();
    res.json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedProject = req.body;

  if (!updatedProject) {
    res.status(404).json({ error: "No data provided to update" });
  }

  try {
    const project = await Projects.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    Object.keys(updatedProject).forEach((key) => {
      if (updatedProject[key] !== undefined) {
        project[key] = updatedProject[key];
      }
    });

    const savedProject = await project.save();

    res.status(200).json(savedProject);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Projects.findByIdAndDelete(id);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting web projects

router.get("/web", async (req, res) => {
  try {
    const projects = await Projects.find(
      { category: "web" },
      { thumbnail: 1, title: 1, description: 1, link: 1, type: 1 }
    );
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// getting AI/ml projects

router.get("/ai-ml", async (req, res) => {
  try {
    const projects = await Projects.find(
      { category: "ai-ml" },
      { thumbnail: 1, title: 1, description: 1, link: 1 }
    );
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// getting game-dev projects
router.get("/game-dev", async (req, res) => {
  try {
    const projects = await Projects.find(
      { category: "game-dev" },
      { thumbnail: 1, title: 1, description: 1, link: 1 }
    );
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
