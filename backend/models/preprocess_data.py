import pandas as pd
import numpy as np

def process_data(data: pd.DataFrame) -> pd.DataFrame:
    """
    Clean and preprocess the dataset for recommendation algorithms
    """
    # Make a copy to avoid modifying original data
    data = data.copy()
    
    # Replace invalid values with NaN
    data['ProdID'] = data['ProdID'].replace(-2147483648, np.nan)
    data['ID'] = data['ID'].replace(-2147483648, np.nan)

    # Convert ID to numeric and clean
    data['ID'] = pd.to_numeric(data['ID'], errors="coerce")
    data = data.dropna(subset=["ID"])

    # Clean ProdID
    data = data.dropna(subset=["ProdID"])
    
    # Remove rows where ID or ProdID is 0
    data = data[(data["ID"] != 0) & (data['ProdID'] != 0)].copy()

    data['ID'] = data["ID"].astype("int64")
    data['ProdID'] = data['ProdID'].astype("int64")

    # LIMIT USERS TO 100 - Get top 100 users with most interactions
    user_counts = data['ID'].value_counts()
    top_100_users = user_counts.head(100).index.tolist()
    data = data[data['ID'].isin(top_100_users)].copy()
    
    # INCREASE PRODUCTS PER USER - Generate more interactions for each user
    enhanced_data = []
    
    for user_id in top_100_users:
        user_data = data[data['ID'] == user_id].copy()
        
        # Add more diverse products for each user
        all_products = data['ProdID'].unique()
        user_products = user_data['ProdID'].unique()
        
        # Add 20-50 more random products per user
        num_additional = np.random.randint(20, 51)
        available_products = [p for p in all_products if p not in user_products]
        
        if len(available_products) > 0:
            additional_products = np.random.choice(
                available_products, 
                min(num_additional, len(available_products)), 
                replace=False
            )
            
            for product_id in additional_products:
                # Get product info
                product_info = data[data['ProdID'] == product_id].iloc[0].to_dict()
                
                # Create new interaction with random rating
                new_interaction = product_info.copy()
                new_interaction['ID'] = user_id
                new_interaction['Rating'] = np.random.uniform(3.0, 5.0)  # Random rating 3-5
                new_interaction['ReviewCount'] = np.random.randint(10, 1000)
                
                enhanced_data.append(new_interaction)
        
        enhanced_data.extend(user_data.to_dict('records'))
    
    # Create enhanced dataframe
    data = pd.DataFrame(enhanced_data)

    # ReviewCount
    data["ReviewCount"] = pd.to_numeric(
        data["ReviewCount"], errors='coerce'
    ).fillna(0).astype("int64")

    # Drop unwanted column if exists
    if 'Unnamed: 0' in data.columns:
        data = data.drop(columns=["Unnamed: 0"])

    # Fill text columns
    for col in ['Category', 'Brand', 'Description', 'Tags']: 
        data[col] = data[col].fillna('')
    
    # Clean ImageURL - take first image if multiple
    if 'ImageURL' in data.columns:
        data['ImageURL'] = (
            data['ImageURL'].astype(str).str.split('|').str[0]
        )
    
    # Fill missing ratings with median
    data['Rating'] = pd.to_numeric(data['Rating'], errors='coerce')
    data['Rating'] = data['Rating'].fillna(data['Rating'].median())
    
    print(f"✅ Processed {len(data['ID'].unique())} users with average {len(data) // len(data['ID'].unique())} products per user")
    
    return data

def load_and_process_data(file_path: str) -> pd.DataFrame:
    """
    Load data from CSV and process it
    """
    try:
        data = pd.read_csv(file_path)
        return process_data(data)
    except Exception as e:
        raise Exception(f"Error loading data: {str(e)}")
