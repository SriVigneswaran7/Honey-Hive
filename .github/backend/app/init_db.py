import sqlite3

def init_database():
  
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
  
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()
    print("[DATABASE] SQLite database initialized and 'users' table created.")

if __name__ == "__main__":
    init_database()