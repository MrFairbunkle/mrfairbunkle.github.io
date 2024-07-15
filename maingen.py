import random, os, openai, anvil

openai.api_key = 'sk-proj-kXnrTHVUKOgSem0MkGyvT3BlbkFJaTrtDgcFwFsthBvwUKKt' # Hide this in .env file

def ask_openai(question): # Makes ChatGPT do stuff
    try:
        response = openai.Completion.create(
            engine="text-davinci-003", 
            prompt=question,
            max_tokens=150,  
            n=1,
            stop=None,
            temperature=0.7 
        )
        
        answer = response.choices[0].text.strip()
        return answer
    except Exception as e:
        return f"An error occurred: {str(e)}"

site_name = input("What is your site called? ")
site_col = input("What would you like the main colour to be? ")
site_sections = input("What sections would you like? Please separate with commas. ")

answer = ask_openai(f"Hello, can you please create me a website for my company, {site_name}, with sections about {site_sections}, with suitable filler content, using {site_col} as the main colour, with appropriate accent colours? Thank you.")

print("Answer:", answer)

html_file_path = "site.html"

try:
    with open(html_file_path, 'w') as file:
        file.write(answer)
    print(f"The content has been saved to {html_file_path}")
except Exception as e:
    print(f"An error occurred while writing to the file: {str(e)}")

# $env:OPENAI_API_KEY='your-api-key-here'
# openai.api_key = os.getenv('OPENAI_API_KEY')
