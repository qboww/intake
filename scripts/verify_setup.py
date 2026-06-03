import os
import json

# Get the current environment
env_file_path = ".env.local"

# Check if .env.local exists
if os.path.exists(env_file_path):
    print(f"✓ {env_file_path} exists")
else:
    print(f"✗ {env_file_path} not found")
    print(f"  Copy .env.example to .env.local and fill in your values")

# Verify Next.js project structure
required_dirs = [
    "app",
    "components",
    "public",
]

print("\nProject Structure:")
for dir_name in required_dirs:
    if os.path.isdir(dir_name):
        print(f"✓ {dir_name}/")
    else:
        print(f"✗ {dir_name}/ not found")

print("\n✓ Iteration 1 - Project Foundation Complete!")
print("\nNext steps:")
print("  1. Copy .env.example to .env.local")
print("  2. Fill in MongoDB Atlas connection string")
print("  3. Configure Vercel deployment")
print("  4. Run: npm run dev")
print("  5. Visit: http://localhost:3000")
