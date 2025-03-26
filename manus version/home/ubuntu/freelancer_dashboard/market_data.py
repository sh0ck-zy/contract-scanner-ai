import pandas as pd
import numpy as np

# Create synthetic data for the freelance market analysis dashboard
# This data is based on the strategic report findings

# 1. Market Size & Growth Data
def generate_market_size_data():
    # Global freelance market size data (in billions USD)
    years = list(range(2020, 2026))
    market_size = [350, 390, 430, 465, 500, 540]  # Projected to reach $500B+ by 2025
    growth_rate = [11.4, 10.3, 8.1, 7.5, 8.0]  # Annual growth rate in percentage
    
    market_df = pd.DataFrame({
        'Year': years,
        'Market_Size_Billions': market_size,
    })
    
    # Add growth rate (except for first year)
    growth_rate_data = [np.nan] + growth_rate
    market_df['Growth_Rate_Percent'] = growth_rate_data
    
    return market_df

# 2. Freelancer Population by Region
def generate_freelancer_population_data():
    regions = ['United States', 'Europe', 'Latin America', 'Southeast Asia', 'Other Regions']
    
    # Population in millions for each year by region
    data = {
        'Region': regions,
        '2020': [55, 30, 22, 40, 28],
        '2021': [57, 32, 24, 45, 30],
        '2022': [58, 33, 27, 52, 32],
        '2023': [59, 34, 30, 60, 35],
        '2024': [60, 35, 34, 70, 38],
        '2025': [62, 37, 38, 82, 41]
    }
    
    population_df = pd.DataFrame(data)
    
    # Reshape for easier plotting
    population_long_df = pd.melt(
        population_df, 
        id_vars=['Region'], 
        var_name='Year', 
        value_name='Population_Millions'
    )
    population_long_df['Year'] = population_long_df['Year'].astype(int)
    
    return population_long_df

# 3. Segment Growth by Freelancer Type
def generate_segment_growth_data():
    segments = [
        'Web Developers', 'Designers', 'Content Writers', 'Marketing Specialists',
        'Business Consultants', 'AI Specialists', 'Data Analysts', 'Translators'
    ]
    
    # Growth rates for each segment (percentage)
    data = {
        'Segment': segments,
        '2021': [12, 10, 8, 11, 7, 25, 15, 5],
        '2022': [14, 11, 9, 12, 8, 28, 17, 6],
        '2023': [15, 12, 10, 14, 9, 30, 18, 7],
        '2024': [16, 13, 11, 15, 10, 34, 20, 8],
        '2025': [18, 15, 12, 16, 11, 38, 22, 9]
    }
    
    segment_df = pd.DataFrame(data)
    
    # Reshape for easier plotting
    segment_long_df = pd.melt(
        segment_df, 
        id_vars=['Segment'], 
        var_name='Year', 
        value_name='Growth_Rate_Percent'
    )
    segment_long_df['Year'] = segment_long_df['Year'].astype(int)
    
    return segment_long_df

# 4. Pain Points Analysis
def generate_pain_points_data():
    pain_points = [
        'Contract Issues', 'Payment Problems', 'Intellectual Property Concerns',
        'Administrative Burden', 'Classification Challenges', 'Tax Compliance',
        'Client Communication', 'Scope Creep'
    ]
    
    # Severity (1-10) and frequency (percentage of freelancers experiencing)
    data = {
        'Pain_Point': pain_points,
        'Severity': [8.5, 9.2, 7.8, 6.5, 7.2, 6.8, 5.9, 8.7],
        'Frequency': [75, 82, 65, 90, 50, 70, 60, 85]
    }
    
    pain_points_df = pd.DataFrame(data)
    
    return pain_points_df

# 5. Regional Variations in Legal Concerns
def generate_regional_legal_concerns():
    regions = ['United States', 'Europe', 'Latin America', 'Southeast Asia']
    concerns = [
        'Contract Enforcement', 'Payment Protection', 'IP Rights', 
        'Tax Compliance', 'Worker Classification'
    ]
    
    # Create a matrix of concern levels (1-10) by region
    data = []
    
    # United States
    data.append({
        'Region': regions[0],
        'Contract Enforcement': 7,
        'Payment Protection': 8,
        'IP Rights': 9,
        'Tax Compliance': 8,
        'Worker Classification': 9
    })
    
    # Europe
    data.append({
        'Region': regions[1],
        'Contract Enforcement': 8,
        'Payment Protection': 7,
        'IP Rights': 8,
        'Tax Compliance': 9,
        'Worker Classification': 8
    })
    
    # Latin America
    data.append({
        'Region': regions[2],
        'Contract Enforcement': 6,
        'Payment Protection': 9,
        'IP Rights': 6,
        'Tax Compliance': 7,
        'Worker Classification': 5
    })
    
    # Southeast Asia
    data.append({
        'Region': regions[3],
        'Contract Enforcement': 5,
        'Payment Protection': 8,
        'IP Rights': 5,
        'Tax Compliance': 6,
        'Worker Classification': 4
    })
    
    regional_concerns_df = pd.DataFrame(data)
    
    # Reshape for easier plotting
    regional_concerns_long_df = pd.melt(
        regional_concerns_df, 
        id_vars=['Region'], 
        var_name='Concern', 
        value_name='Severity'
    )
    
    return regional_concerns_long_df

# 6. Experience Level vs. Legal Concerns
def generate_experience_vs_concerns():
    experience_levels = ['Beginner (0-1 years)', 'Intermediate (2-5 years)', 'Experienced (6-10 years)', 'Expert (10+ years)']
    concerns = [
        'Contract Issues', 'Payment Problems', 'IP Concerns', 
        'Administrative Burden', 'Classification Challenges'
    ]
    
    # Create data with concern levels (1-10) by experience
    data = []
    
    # Beginner
    data.append({
        'Experience': experience_levels[0],
        'Contract Issues': 9,
        'Payment Problems': 9,
        'IP Concerns': 6,
        'Administrative Burden': 8,
        'Classification Challenges': 7
    })
    
    # Intermediate
    data.append({
        'Experience': experience_levels[1],
        'Contract Issues': 8,
        'Payment Problems': 8,
        'IP Concerns': 8,
        'Administrative Burden': 7,
        'Classification Challenges': 8
    })
    
    # Experienced
    data.append({
        'Experience': experience_levels[2],
        'Contract Issues': 6,
        'Payment Problems': 6,
        'IP Concerns': 9,
        'Administrative Burden': 5,
        'Classification Challenges': 7
    })
    
    # Expert
    data.append({
        'Experience': experience_levels[3],
        'Contract Issues': 4,
        'Payment Problems': 4,
        'IP Concerns': 9,
        'Administrative Burden': 3,
        'Classification Challenges': 5
    })
    
    experience_concerns_df = pd.DataFrame(data)
    
    # Reshape for easier plotting
    experience_concerns_long_df = pd.melt(
        experience_concerns_df, 
        id_vars=['Experience'], 
        var_name='Concern', 
        value_name='Severity'
    )
    
    return experience_concerns_long_df

# 7. User Segmentation - Demographics
def generate_user_demographics():
    segments = [
        'Web Developers', 'Designers', 'Content Writers', 'Marketing Specialists',
        'Business Consultants', 'AI Specialists', 'Data Analysts', 'Translators'
    ]
    
    data = {
        'Segment': segments,
        'Average_Age': [32, 30, 35, 33, 42, 29, 31, 38],
        'Percent_Male': [70, 55, 40, 45, 60, 75, 65, 35],
        'Percent_Female': [30, 45, 60, 55, 40, 25, 35, 65],
        'Percent_US_Based': [45, 40, 35, 50, 55, 60, 45, 30],
        'Percent_Europe_Based': [30, 35, 30, 25, 30, 25, 30, 40],
        'Percent_Other_Regions': [25, 25, 35, 25, 15, 15, 25, 30],
        'Average_Experience_Years': [5.5, 4.8, 4.2, 5.0, 7.5, 3.5, 4.5, 6.0]
    }
    
    demographics_df = pd.DataFrame(data)
    
    return demographics_df

# 8. Income Levels and Willingness to Pay
def generate_income_willingness_data():
    segments = [
        'Web Developers', 'Designers', 'Content Writers', 'Marketing Specialists',
        'Business Consultants', 'AI Specialists', 'Data Analysts', 'Translators'
    ]
    
    data = {
        'Segment': segments,
        'Average_Annual_Income_USD': [95000, 85000, 65000, 90000, 120000, 140000, 95000, 60000],
        'Willingness_To_Pay_Monthly_USD': [35, 30, 20, 32, 45, 50, 35, 18],
        'Percent_Using_Paid_Tools': [85, 80, 65, 75, 90, 95, 85, 60]
    }
    
    income_df = pd.DataFrame(data)
    
    return income_df

# 9. Competitive Landscape - Positioning Map Data
def generate_competitive_positioning():
    competitors = [
        'Our Solution', 'Traditional Lawyers', 'LegalZoom', 'Bonsai', 
        'AND.CO', 'Generic Templates', 'DIY Contracts', 'Upwork Contracts'
    ]
    
    data = {
        'Competitor': competitors,
        'Legal_Confidence': [9.0, 9.5, 8.0, 6.5, 6.0, 3.5, 2.0, 5.0],
        'Speed_Simplicity': [8.5, 3.0, 5.5, 7.5, 7.0, 6.0, 4.0, 7.5],
        'Market_Share_Percent': [0, 15, 20, 12, 10, 25, 8, 10],
        'Category': ['AI-Powered', 'Traditional', 'Legal Service', 'Template Provider', 
                    'Template Provider', 'Basic Template', 'DIY', 'Marketplace']
    }
    
    positioning_df = pd.DataFrame(data)
    
    return positioning_df

# 10. Feature Comparison
def generate_feature_comparison():
    competitors = [
        'Our Solution', 'Traditional Lawyers', 'LegalZoom', 'Bonsai', 
        'AND.CO', 'Generic Templates', 'DIY Contracts'
    ]
    
    features = [
        'AI-Powered Generation', 'Jurisdiction Awareness', 'Plain Language Explanations',
        'Customization Options', 'E-Signature', 'Regulatory Updates', 'Legal Confidence',
        'Speed of Creation', 'Affordable Pricing'
    ]
    
    # Create a matrix of feature availability (1 = yes, 0 = no, 0.5 = partial)
    data = []
    
    # Our Solution
    data.append({
        'Competitor': competitors[0],
        'AI-Powered Generation': 1,
        'Jurisdiction Awareness': 1,
        'Plain Language Explanations': 1,
        'Customization Options': 1,
        'E-Signature': 1,
        'Regulatory Updates': 1,
        'Legal Confidence': 1,
        'Speed of Creation': 1,
        'Affordable Pricing': 1
    })
    
    # Traditional Lawyers
    data.append({
        'Competitor': competitors[1],
        'AI-Powered Generation': 0,
        'Jurisdiction Awareness': 1,
        'Plain Language Explanations': 0.5,
        'Customization Options': 1,
        'E-Signature': 0.5,
        'Regulatory Updates': 1,
        'Legal Confidence': 1,
        'Speed of Creation': 0,
        'Affordable Pricing': 0
    })
    
    # LegalZoom
    data.append({
        'Competitor': competitors[2],
        'AI-Powered Generation': 0.5,
        'Jurisdiction Awareness': 1,
        'Plain Language Explanations': 0.5,
        'Customization Options': 0.5,
        'E-Signature': 1,
        'Regulatory Updates': 0.5,
        'Legal Confidence': 0.5,
        'Speed of Creation': 0.5,
        'Affordable Pricing': 0.5
    })
    
    # Bonsai
    data.append({
        'Competitor': competitors[3],
        'AI-Powered Generation': 0,
        'Jurisdiction Awareness': 0.5,
        'Plain Language Explanations': 0.5,
        'Customization Options': 1,
        'E-Signature': 1,
        'Regulatory Updates': 0.5,
        'Legal Confidence': 0.5,
        'Speed of Creation': 1,
        'Affordable Pricing': 0.5
    })
    
    # AND.CO
    data.append({
        'Competitor': competitors[4],
        'AI-Powered Generation': 0,
        'Jurisdiction Awareness': 0.5,
        'Plain Language Explanations': 0.5,
        'Customization Options': 1,
        'E-Signature': 1,
        'Regulatory Updates': 0.5,
        'Legal Confidence': 0.5,
        'Speed of Creation': 1,
        'Affordable Pricing': 0.5
    })
    
    # Generic Templates
    data.append({
        'Competitor': competitors[5],
        'AI-Powered Generation': 0,
        'Jurisdiction Awareness': 0,
        'Plain Language Explanations': 0,
        'Customization Options': 0.5,
        'E-Signature': 0,
        'Regulatory Updates': 0,
        'Legal Confidence': 0,
        'Speed of Creation': 1,
        'Affordable Pricing': 1
    })
    
    # DIY Contracts
    data.append({
        'Competitor': competitors[6],
        'AI-Powered Generation': 0,
        'Jurisdiction Awareness': 0,
        'Plain Language Explanations': 0,
        'Customization Options': 1,
        'E-Signature': 0,
        'Regulatory Updates': 0,
        'Legal Confidence': 0,
        'Speed of Creation': 0,
        'Affordable Pricing': 1
    })
    
    feature_df = pd.DataFrame(data)
    
    # Reshape for easier plotting
    feature_long_df = pd.melt(
        feature_df, 
        id_vars=['Competitor'], 
        var_name='Feature', 
        value_name='Availability'
    )
    
    return feature_long_df

# 11. Pricing Analysis
def generate_pricing_data():
    competitors = [
        'Our Solution', 'Traditional Lawyers', 'LegalZoom', 'Bonsai', 
        'AND.CO', 'Generic Templates', 'Upwork Contracts'
    ]
    
    data = {
        'Competitor': competitors,
        'Monthly_Subscription_USD': [30, None, 40, 25, 20, 10, 0],
        'Per_Contract_Cost_USD': [0, 500, 100, 0, 0, 5, 0],
        'Annual_Cost_Estimate_USD': [360, 2000, 480, 300, 240, 120, 0]
    }
    
    # Replace None with NaN for proper handling in pandas
    pricing_df = pd.DataFrame(data).replace({None: np.nan})
    
    return pricing_df

# 12. Addressable Market Size by Region
def generate_addressable_market():
    regions = ['United States', 'Europe', 'Latin America', 'Southeast Asia', 'Other Regions']
    
    data = {
        'Region': regions,
        'Total_Freelancers_Millions': [62, 37, 38, 82, 41],
        'Addressable_Percent': [65, 55, 40, 35, 30],
        'Avg_Annual_Revenue_Per_User_USD': [360, 300, 240, 180, 180]
    }
    
    addressable_df = pd.DataFrame(data)
    
    # Calculate total addressable market
    addressable_df['Addressable_Freelancers_Millions'] = (
        addressable_df['Total_Freelancers_Millions'] * 
        addressable_df['Addressable_Percent'] / 100
    )
    
    addressable_df['Total_Addressable_Market_Millions_USD'] = (
        addressable_df['Addressable_Freelancers_Millions'] * 
        addressable_df['Avg_Annual_Revenue_Per_User_USD']
    )
    
    return addressable_df

# 13. Conversion Potential Analysis
def generate_conversion_data():
    segments = [
        'Web Developers', 'Designers', 'Content Writers', 'Marketing Specialists',
        'Business Consultants', 'AI Specialists', 'Data Analysts', 'Translators'
    ]
    
    data = {
        'Segment': segments,
        'Awareness_Rate_Percent': [70, 65, 60, 75, 80, 85, 70, 55],
        'Trial_Rate_Percent': [40, 35, 30, 45, 50, 55, 40, 25],
        'Conversion_Rate_Percent': [25, 20, 15, 30, 35, 40, 25, 10],
        'Retention_Rate_Percent': [80, 75, 70, 85, 90, 90, 80, 65]
    }
    
    conversion_df = pd.DataFrame(data)
    
    return conversion_df

# 14. Revenue Projection
def generate_revenue_projection():
    years = list(range(2025, 2030))
    scenarios = ['Conservative', 'Moderate', 'Optimistic']
    
    # Create data for different scenarios
    data = []
    
    # Conservative scenario
    for year in years:
        data.append({
            'Year': year,
            'Scenario': scenarios[0],
            'Users_Thousands': 50 * (year - 2024) * 1.2,
            'ARPU_USD': 300,
            'Revenue_Millions_USD': 50 * (year - 2024) * 1.2 * 300 / 1000
        })
    
    # Moderate scenario
    for year in years:
        data.append({
            'Year': year,
            'Scenario': scenarios[1],
            'Users_Thousands': 80 * (year - 2024) * 1.3,
            'ARPU_USD': 330,
            'Revenue_Millions_USD': 80 * (year - 2024) * 1.3 * 330 / 1000
        })
    
    # Optimistic scenario
    for year in years:
        data.append({
            'Year': year,
            'Scenario': scenarios[2],
            'Users_Thousands': 120 * (year - 2024) * 1.4,
            'ARPU_USD': 360,
            'Revenue_Millions_USD': 120 * (year - 2024) * 1.4 * 360 / 1000
        })
    
    revenue_df = pd.DataFrame(data)
    
    return revenue_df

# Generate all datasets
def generate_all_data():
    data = {
        'market_size': generate_market_size_data(),
        'freelancer_population': generate_freelancer_population_data(),
        'segment_<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>