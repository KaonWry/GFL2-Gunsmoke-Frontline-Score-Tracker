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

## Project Structure

```
gfl2-gunsmoke-score-tracker/
├── backend/
│   ├── app.py           # Flask API (add/get/delete/recap attempts)
│   ├── db_init.py       # Initialize the database
│   ├── db_clear.py      # Reset the attempts table
│   ├── raid_data.db     # SQLite database file (created after init)
├── frontend/
│   ├── app/
│   │   ├── components/
│   │   │   └── Navbar.js      # Navigation bar component
│   │   ├── input/
│   │   │   └── page.js        # Add Attempt page
│   │   ├── log/
│   │   │   └── page.js        # Log page (all attempts, delete support)
│   │   ├── recap/
│   │   │   └── page.js        # Recap analytics page
│   │   ├── layout.js          # Root layout with navbar
│   │   ├── page.js            # Default export of input/page.js
│   │   └── globals.css        # Global styles
│   ├── package.json           # Frontend dependencies
│   └── ...                    # Other Next.js config files
```

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
The API will be available at `http://localhost:5000`.

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
    "doll3": "",
    "doll4": "",
    "doll5": ""
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

- [ ] **Export Data**
  - Add a button to export all attempts as CSV or Excel.

- [ ] **Responsive Design**
  - Improve frontend layout for mobile and tablet devices.

- [ ] **Frontend Enhancements**
  - Show loading indicators and error messages.
  - Add confirmation dialogs for deleting attempts
