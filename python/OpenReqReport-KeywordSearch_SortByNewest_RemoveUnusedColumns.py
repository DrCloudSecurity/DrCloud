# need pandas to work with excel file
import pandas as pd


# prompt for file
input_file = input("Enter Excel file name: ")

# prompt for keyword
keyword = input("Enter keyword to search in 'Job Description': ")

# output file
output_file = "ORR_cleaned_up.xlsx"


# load file into dataframe
df = pd.read_excel(input_file)


# confirm required columns are there
required_columns = {"Job Description", "Recruiting Start Date"}
if not required_columns.issubset(df.columns):
    raise ValueError(f"Missing required columns: {required_columns - set(df.columns)}")


# filter rows where 'Job Description' has the keyword
filtered_df = df[df["Job Description"].str.contains(keyword, case=False, na=False)]


# sort by 'date' column
filtered_df = filtered_df.sort_values(by="Recruiting Start Date", ascending=False)


# remove columns that we do not need
filtered_df = filtered_df.drop(columns=["Posted Internally Only", "Team", "IMT", "Job Profile", "Job Requisition Status"], errors='ignore')


# send to new file
filtered_df.to_excel(output_file, index=False)

print(f"Cleaned up ORR has been saved to {output_file}")
