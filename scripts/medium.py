import requests
from bs4 import BeautifulSoup

def scrape_quotes(url):
    # Send a GET request to the URL
    response = requests.get(url)
    # If the response was successful (HTTP status code 200)
    if response.status_code == 200:
        # Parse the HTML content of the page
        soup = BeautifulSoup(response.text, 'html.parser')
        # Find all <div> elements with the class 'quote'
        h3s = soup.findAll('h3')

        # Extract and print the text from each quote <div>
        for h3 in h3s:
            quote_text = h3.get_text(strip=True)
            print(quote_text)
    else:
        print(f'Failed to retrieve data. Status code: {response.status_code}')


query = "react js"
arr = query.split()
finalQuery = "%20".join(arr)
url = f"https://hashnode.com/search?q={query}" 
scrape_quotes(url)
