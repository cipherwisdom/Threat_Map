from flask import Flask, jsonify
import pandas as pd
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

VIRUSTOTAL_API_KEY = "155c80a0967da83583a6ce9247d2f84257365049cff4ebd5717975b782e7ab63"


def fetch_country(ip):
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
    headers = {"x-apikey": VIRUSTOTAL_API_KEY}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        data = response.json()
        country = data["data"]["attributes"]["country"]
        return country
    except Exception as e:
        return f"Error fetching country for IP {ip}: {str(e)}"


@app.route("/api/fetch-ip-countries")
def fetch_ip_countries():
    try:
        # Read IP addresses from Excel sheet
        excel_file = "F:/soar/threatmaps/threatmap/backend/IP.xlsx"
        df = pd.read_excel(excel_file)

        # Fetch country for each IP address
        ip_countries = {}
        for ip in df["IP Address"]:
            country = fetch_country(ip)
            ip_countries[ip] = country

        return jsonify(ip_countries)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
