# download a copy of the firm's ORR from Workday
# do not select any filters, click ok, then download
# search the report for keywords, only return the rows that match

# this cleans up the firm's ORR listings by sorting by date, newest reqs first

# required pkgs to make this work. run this from PyCharm term
# pip install pandas openpyxl

# need pands for excel
import pandas as pd

# future updates may include
# keyword search for: level, remove, clearance


# dl report has a style error. this fixes it.
# if you are troubleshooting comment this out first
import warnings
# warnings.simplefilter("ignore")
warnings.filterwarnings("ignore", message="Workbook contains no default style", category=UserWarning)


# load excel in pandas
file_path = './OpenReqReport.xlsx'
df = pd.read_excel(file_path)


# sort by 'date' column to get Chipotle-fresh reqs at the top
# ascending=false
df_sorted = df.sorted_values(by='Recruiting Start Date', ascending=False)


# save the sorted file to a new file
sorted_file_path = './ORR update.xlsx'
df_sorted.to_excel(sorted_file_path, index=False)


# exit nice and clean
print(f"Fresh ORR ready! \n{sorted_file_path}")