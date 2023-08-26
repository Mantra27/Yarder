import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression

# Load CSV data
locations_data = pd.read_csv('/Users/mantragohil/Documents/code/Yarder/model/yard_locations.csv')
past_in_out_data = pd.read_csv('/Users/mantragohil/Documents/code/Yarder/model/past_in_out.csv')
incoming_data = pd.read_csv('/Users/mantragohil/Documents/code/Yarder/model/incoming_containers.csv')

# Combine data based on common attributes
combined_data = incoming_data.merge(past_in_out_data, on='CON_NUM').merge(locations_data, on='CON_NUM')

# Prepare incoming container data
incoming_container_data = combined_data.iloc[0]  # Assuming you want the first incoming container

incoming_container = {
    'ID': incoming_container_data['ID'],
    'IN_TIME': incoming_container_data['IN_TIME'],
    'REF_ID': incoming_container_data['REF_ID'],
    'CON_SIZE': incoming_container_data['CON_SIZE'],
    'STATUS': incoming_container_data['STATUS'],
    # ... include other features
}

# Normalize data
scaler = StandardScaler()
scaler.fit(combined_data.drop(['CON_NUM'], axis=1))  # Drop label from scaling
normalized_incoming_features = scaler.transform([list(incoming_container.values())])

# Load model (if needed)
# model = load_your_model_function('path/to/saved/model')

# Make predictions for incoming containers (using Linear Regression for example)
# predicted_container_num = model.predict(normalized_incoming_features)

# For the sake of demonstration, let's use a simple Linear Regression model
x_train = combined_data.drop(['CON_NUM'], axis=1)
y_train = combined_data['CON_NUM']

model = LinearRegression()
model.fit(x_train, y_train)

predicted_container_num = model.predict(normalized_incoming_features)
print(f'Predicted Container Number: {predicted_container_num[0]}')
