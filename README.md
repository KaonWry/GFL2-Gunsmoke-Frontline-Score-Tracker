# GFL2 Gunsmoke Frontline Score Tracker

A simple web app for tracking and reviewing player attempts and scores for Gunsmoke Frontline.  
Built with Flask (Python) for the backend and plain HTML/JavaScript for the frontend (so far :D).

---

## Features

- Add new player attempts with score and up to 5 dolls.
- View all attempts in a recap table.
- Reset the database for clean testing.

---

## Project Structure

```
gfl2-gunsmoke-score-tracker/
├── backend/
│   ├── app.py           # Flask API (add/get attempts)
│   ├── db_init.py       # Initialize the database
│   ├── db_clear.py      # Reset the attempts table
│   ├── raid_data.db     # SQLite database file (created after init)
├── frontend/
│   ├── index.html       # Form to add attempts
│   └── recap.html       # Table to view all attempts
```

---

## Setup & Usage

### 1. Install Requirements

**Make sure you have Python 3.7+ installed.**

Install dependencies from the provided `requirements.txt` file:

```sh
pip install -r requirements.txt
```

### 2. Initialize the Database

```sh
python db_init.py
```

### 3. Run the Flask Backend

```sh
python app.py
```
The API will be available at `http://localhost:5000`.

### 4. Use the Frontend

- Open `frontend/index.html` in your browser to add attempts.
- Open `frontend/recap.html` to view all attempts.

---

## API Endpoints

- `POST /add_attempt`  
  Add a new attempt.  
  **Body:**  
  ```json
  {
    "player_name": "Alice",
    "score": 12345,
    "doll1": "Klukai",
    "doll2": "Mechty",
    "doll3": "",
    "doll4": "",
    "doll5": ""
  }
  ```

- `GET /get_attempts`  
  Returns all attempts as a JSON array.

---

## Resetting the Database

To clear all attempts and reset the ID counter:

```sh
python db_clear.py
```

---

## TODO

- [ ] **Player Analytics in Recap**
  - Show total attempts, average score, highest score, and lowest score for each player.
  - Display a summary section above or below the attempts table.

- [ ] **Export Data**
  - Add a button to export all attempts as CSV or Excel.

- [ ] **Edit/Delete Attempts**
  - Allow users to edit or delete individual attempts from the recap table.


- [ ] **Responsive Design**
  - Improve frontend layout for mobile and tablet devices.

- [ ] **API Improvements**
  - Add endpoints for analytics (e.g., `/player_stats`).
  - Add pagination for large numbers of attempts.

- [ ] **Frontend Enhancements**
  - Show loading indicators and error messages.
  - Add confirmation dialogs for deleting attempts.

---

## License