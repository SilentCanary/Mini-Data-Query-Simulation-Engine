    from transformers import AutoTokenizer
    from fastapi import FastAPI, HTTPException
    import requests
    import os
    
    HF_API_KEY = "YOUR-HUGGING-FACE-API-KEY "
    API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"  
    HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}  
    tokenizer = AutoTokenizer.from_pretrained("mistralai/Mistral-7B-Instruct-v0.1")
    
    app = FastAPI()
    
    @app.post("/query")
    async def convert_to_sql(request: dict):
        try:
            query = request.get("query")
            schema=request.get("schema")
            if not query:
                raise HTTPException(status_code=400, detail="Query input is empty")
            if not schema:
                raise HTTPException(status_code=400,detail="schema input is empty")
            input_text = f"Translate to SQLite:\nSchema:\n{schema}\nUser Query: {query}"

    
            response = requests.post(API_URL, headers=HEADERS, json={"inputs": input_text})
    
            if response.status_code != 200:
                return {"error": response.json()}
    
            sql_query = response.json()[0]['generated_text']
    
            import re
            #sql_query = re.sub(r"^Translate.*?:", "", sql_query, flags=re.IGNORECASE).strip()
            #sql_query = re.sub(r"Schema:.*?User Query:.*?", "", sql_query, flags=re.DOTALL).strip()
            sql_query=re.sub(r"(?i)^.*?(SELECT|INSERT|UPDATE|DELETE)", r"\1", sql_query, flags=re.DOTALL)
            match = re.search(r"```sql\n(.*?)\n```", sql_query, re.DOTALL)
            if match:
                sql_query = match.group(1).strip()
    
            return {"sql_query": sql_query}
    
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    if __name__ == "__main__":
        import uvicorn
        import nest_asyncio
        nest_asyncio.apply()
        uvicorn.run(app, host="0.0.0.0", port=5000)
