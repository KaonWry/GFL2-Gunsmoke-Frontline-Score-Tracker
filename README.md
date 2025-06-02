# GFL2 Gunsmoke Frontline Score Tracker

A simple web app for tracking and reviewing player attempts and scores for Gunsmoke Frontline.  
Built with Flask (Python) for the backend and a Next.js (React) frontend.

---

## Features

- Add new player attempts with score and up to 5 dolls.
- View all attempts inputted.
- View player analytics (highest score, total score).
- Reset the database for clean testing.

---

## Setup & Usage

### 1. Backend

**Make sure you have Python 3.7+ installed.**

Install dependencies from the provided `requirements.txt` file:

```sh
cd backend
pip install -r requirements.txt
```

Initialize the database:

```sh
python db_init.py
```

Run the Flask backend:

```sh
python app.py
```
The API will be available at [http://localhost:5000](http://localhost:5000).

---

### 2. Frontend

**Make sure you have Node.js 18+ installed.**

Install frontend dependencies:

```sh
cd frontend
npm install
```

Run the Next.js development server:

```sh
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

### 3. Using the App

- **Add Attempt:**  
  Go to `/input` (or `/`) to add a new attempt.
- **View Log:**  
  Go to `/log` to see all attempts and delete entries.
- **View Recap:**  
  Go to `/recap` to see player analytics (highest score, total score).
- **Navigate:**  
  Use the navbar at the top to switch between pages.

---

## Metrics Explained

The **Recap** page displays several player metrics.  
Below are the explanations for each metric:

- **Highest Score:**  
  The single highest score achieved by the player across all their attempts.

- **Total Score:**  
  The sum of all scores from all attempts made by the player. 

- **Count:**  
  The total number of attempts the player has made.

- **Absolute Efficiency:**  
  A measure of how close the player's total score is to their theoretical maximum, assuming they played every possible attempt (7 days, twice a day). A lower value means the player either missed attempts or didn't perform close to their best in each attempt.

  _Formula:_  
  `Absolute Efficiency = Total Score / (Highest Score × 14)`  

- **Relative Efficiency:**  
  A measure of how close the player's total score is to their theoretical maximum, based only on the number of attempts they actually made. It shows how efficiently a player performed in the attempts they actually made, regardless of how many times they played.

  _Formula:_  
  `Relative Efficiency = Total Score / (Highest Score × Attempt Count)`  

- **Peak-Average Gap:**  
  The difference between the player's highest score and their average score. It shows the consistency of the player. A smaller gap means the player performs close to their best most of the time, while a larger gap suggests occasional high peaks but lower average performance.

  _Formula:_  
  `Peak-Average Gap = Highest Score - (Total Score / Count)`

---

## API Endpoints

- `POST /add_attempt`  
  Add a new attempt.  
  **Body:**  
  ```json
  {
    "player_name": "KaonWry",
    "score": 2345,
    "doll1": "Klukai",
    "doll2": "Mechty",
    "doll3": "Suomi",
    "doll4": "Qiongjiu",
    "doll5": "Sharkry"
  }
  ```

- `GET /get_attempts`  
  Returns all attempts as a JSON array.

- `DELETE /delete_attempt/<id>`  
  Deletes an attempt by its ID.

- `GET /recap_players`  
  Returns player analytics (player name, highest score, total score).

---

## Resetting the Database

To clear all attempts and reset the ID counter:

```sh
python db_clear.py
```

---

## TODO

- [x] **Player Analytics in Recap**
  - Show total attempts, average score, highest score, and lowest score for each player.
  - Display a summary section above or below the attempts table.

- [x] **Edit/Delete Attempts**
  - Allow users to edit or delete individual attempts from the log table.

- [x] **API Improvements**
  - Add endpoints for analytics (`/recap_players`).
  - Add pagination for large numbers of attempts.

- [x] **Frontend Enhancements**
  - Show loading indicators and error messages.
  - Add confirmation dialogs for deleting attempts

- [x] **Export Data**
  - Add a button to export all attempts as CSV or Excel.

- [ ] **Responsive Design**
  - Improve frontend layout for mobile and tablet devices.
