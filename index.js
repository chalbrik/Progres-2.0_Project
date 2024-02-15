import express from "express";
import ejs from "ejs";
import pg from "pg";
import bodyParser from "body-parser";

const app = express();
const port = 3011;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "gym-progres",
  password: "Czuj3N4tchni3ni3",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getExerciseData() {
  const result = await db.query("SELECT * FROM gym_exercises ORDER BY id ASC");
  const data = result.rows; //tutaj mam ciąg obiektów js z danymi wszystkimi cwiczeń dotyczących bicepsa

  return data;
}

async function getBodyPartsData() {
  const result = await db.query("SELECT * FROM body_parts ORDER BY id ASC");
  const data = result.rows; //tutaj mam ciąg obiektów js z danymi wszystkimi cwiczeń dotyczących bicepsa

  return data;
}

app.get("/", async (req, res) => {
  try {
    const bodyPartsData = await getBodyPartsData();
    const exerciseData = await getExerciseData();
    res.render("index.ejs", {
      bodyPartsData: bodyPartsData,
      exerciseData: exerciseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

app.post("/changeWeight", async (req, res) => {
  const input = req.body;
  console.log(input);

  try {
    await db.query("UPDATE gym_exercises SET weight = $1 WHERE id = $2", [
      input.NewWeight,
      input.exerciseId,
    ]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.status(500).send("Wystąpił błąd podczas pobierania danych.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
