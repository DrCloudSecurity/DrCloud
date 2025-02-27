# download a copy of the firm's ORR from Workday
# do not select any filters, click ok, then download
# search the report for keywords, only return the rows that match

# this cleans up the firm's ORR listings by running a keyword search
# on the 'job description' field

#  required pkgs to make this work. run this from PyCharm term
# pip install pandas openpyxl

# need pands for excel
import pandas as pd


# dl report has a style error. this fixes it
# if you are troubleshooting comment this out first
import warnings
# warnings.simplefilter("ignore")
warnings.filterwarnings("ignore", message="Workbook contains no default style", category=UserWarning)


# search column_name, keep only those rows
def search_column(file_path, column_name):

    # read excel file
    df = pd.read_excel(file_path)

    # verify column exists or throw error
    if column_name not in df.columns:
        print(f"Error: Column '{column_name}' was not found.")
        return

    # prompt for search, explain wildcard use
    search_value = input(f"Enter the value you want to search for in column '{column_name}':")

    # run search
    search_results = df[df[column_name].str.contains(search_value, case=False, na=False)]


    #check for results, show a few
    if not search_results.empty:
        print(f"Found the following rows containing '{search_value}' in column '{column_name}':")
        print(search_results)

        # save results to file
        sorted_file_path = './ORR_update.xlsx'
        search_results.to_excel(sorted_file_path, index=False)
        print(f"Fresh ORR ready here: '{sorted_file_path}'.")
    else:
        # if no results exit
        print(f"No results found for '{search_value}' in column '{column_name}'.")


# name of ORR and job description column
file_path = './SuperEvilMegaCorp-Open_Requisition_Report.xlsx'
column_name = 'Job Description'