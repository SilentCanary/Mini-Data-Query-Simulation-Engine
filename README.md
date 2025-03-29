# Mini Data Query Simulation Engine
The AI-Powered Data Query Simulation Engine is a REST API designed to simulate an AI-powered data query system. It processes natural language queries, converts them into pseudo-SQL using LLM Model(Mistral-7B), validates them, and generates mock responses.
### 🔄 How It Works:
1. **Query Input**: You send a query along with the target table name to the Node.js server (e.g., via a curl command).
2. **Authentication**: The Node.js server authenticates the request using a simple login system with cookies and JWT (JSON Web Tokens).
3. **Query Conversion**: Once authenticated, the server forwards your query along with the table schema to a Python service.
4. **Query Translation**: The Python service (using Mistral 7B) converts the natural language query into SQL.
5. **SQL Validation & Execution**: The generated SQL is validated and executed against a SQLite database.
6. **Results**: The results of the SQL query execution are returned to the user.

### 🏗 Microservice Architecture:
- The application follows a **Microservice Architecture**:
  - **Node.js Server**: Handles API requests and authentication (JWT-based).
  - **Python Service**: Focuses on converting natural language queries into SQL using the Mistral 7B model.
---

### 🔧 Prerequisites
- **Node.js (v14 or later) & npm**
- **SQLite3**
- **Python (3.8 or later) with dependencies**  
  - Required for the LLM service handling query conversion.  
---

## 📥 Set-up Instructions

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/ai-data-query-engine.git
   cd ai-data-query-engine
   ```
2 **Install Node.js Dependencies:**
  ```sh
   npm install
   ```
3 ** Start the Node.js Server:**
  ```sh
   node server.js
   ```
4 **Install python Dependencies:**
  ```sh
   pip install -r requirements.txt
   ```
5 **Hugging Face API Key Setup**
The Python service requires a Hugging Face API key to access the Mistral 7B model.
  a) Obtain an API Key
      Sign up at Hugging Face (if you don’t have an account).
      Go to Settings → Access Tokens and generate a key.
  b) Add Your API Key in nlmtosql.py
  
6 **Run the Python LLM Service:**
In a separate terminal window, run:
  ```sh
   python nlmtosql.py
   ```
This script runs the LLM service that converts natural language queries into SQL.

# Testing the API
🔹 Using curl
You can test the API using curl commands:
1. **Login**
   ```sh
   curl -X POST "http://localhost:3000/api/auth/login" \
     -H "Content-Type: application/json" \
     -c cookies.txt \
     -d '{"username":"admin","password":"password"}'
   ```
 This logs in the user and stores the authentication cookie in cookies.txt.

 2. Make an Authenticated Query
    ```sh
     curl -X POST "http://localhost:3000/api/query" \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{"query":"Show me all sales for 2024, including quantity and prices by category", "table":"sales"}'
    ```
    This sends a natural language query to the API and retrieves SQL-based results.
3. Logout
    ```sh
    curl -X POST "http://localhost:3000/api/auth/logout" \
     -b cookies.txt
    ```
📡 API Endpoints  

| Endpoint         | Method | Description                                    |
|----------------- |--------|----------------------------------------------- |
| `/api/login`     | `POST`  | User authentication using JWT & cookies.      |
| `/api/query`     | `POST`  | Converts a natural language query into SQL.   |
| `/api/validate`  | `POST`  | Validates the generated SQL before execution. |
| `/api/logout`    | `POST`  | Logs out the user.                            |

### 📝 Example Query & Response

#### **Input Query:**
```json
{
  "query": "Show me all sales for 2024, including quantity and prices by category",
  "table": "sales"
}
```
**Generated SQL Output:**
```sql
SELECT category, SUM(quantity) AS total_quantity, SUM(price) AS total_price 
FROM sales 
WHERE year = 2024 
GROUP BY category;
```

![image](https://github.com/user-attachments/assets/dd64787d-bad2-4d2a-a846-97f979fa89cd)

# Future Enchancements 
1.**Improving SQL Query Accuracy**
The current system generates SQL queries that may not always be perfect.
To enhance reliability, tool-calling functionality will be integrated for better query execution.

2) Step-by-Step SQL Refinement (Chain-of-Thought)
Instead of generating SQL in a single step, a multi-step approach will be used for better accuracy.
Convert English to SQL.
Iteratively execute & refine queries until the correct output is obtained.
Use system prompts & Chain-of-Thought reasoning to improve logical breakdown
