from app.pipeline import hybrid_pipeline

query = input("Enter query: ")

summary, results = hybrid_pipeline(query)

print("\n=== SUMMARY ===\n")
print(summary)

print("\n=== PAPERS ===\n")
for r in results:
    print("-", r["title"])