import dash
from dash import dcc, html
import dash_bootstrap_components as dbc
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
# Import callbacks
from callbacks import *

# Load all the data files
def load_data():
    data = {}
    data_files = [
        'market_size', 'freelancer_population', 'segment_growth', 'pain_points',
        'regional_legal_concerns', 'experience_vs_concerns', 'user_demographics',
        'income_willingness', 'competitive_positioning', 'feature_comparison',
        'pricing_data', 'addressable_market', 'conversion_data', 'revenue_projection'
    ]
    
    for file in data_files:
        data[file] = pd.read_csv(f'/home/ubuntu/freelancer_dashboard/{file}.csv')
    
    return data

# Initialize the Dash app with Bootstrap theme
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
server = app.server

# Load the data
data = load_data()

# Define color schemes
colors = {
    'primary': '#3366CC',
    'secondary': '#FF9900',
    'accent': '#109618',
    'background': '#F9F9F9',
    'text': '#333333',
    'grid': '#DDDDDD',
    'highlight': '#DC3912',
    'regions': px.colors.qualitative.Bold,
    'segments': px.colors.qualitative.Pastel,
    'pain_points': px.colors.sequential.Viridis,
    'scenarios': ['#3366CC', '#109618', '#FF9900']  # Conservative, Moderate, Optimistic
}

# Create Market Size & Growth visualization
def create_market_size_chart():
    df = data['market_size']
    
    fig = go.Figure()
    
    # Add bar chart for market size
    fig.add_trace(go.Bar(
        x=df['Year'],
        y=df['Market_Size_Billions'],
        name='Market Size (Billions USD)',
        marker_color=colors['primary'],
        text=df['Market_Size_Billions'].apply(lambda x: f'${x}B'),
        textposition='auto'
    ))
    
    # Add line chart for growth rate
    fig.add_trace(go.Scatter(
        x=df['Year'],
        y=df['Growth_Rate_Percent'],
        name='Growth Rate (%)',
        mode='lines+markers',
        yaxis='y2',
        line=dict(color=colors['highlight'], width=3),
        marker=dict(size=8)
    ))
    
    # Update layout
    fig.update_layout(
        title='Global Freelance Market Size & Growth (2020-2025)',
        xaxis=dict(title='Year', tickmode='linear'),
        yaxis=dict(
            title='Market Size (Billions USD)',
            title_font=dict(color=colors['primary']),
            tickfont=dict(color=colors['primary'])
        ),
        yaxis2=dict(
            title='Growth Rate (%)',
            title_font=dict(color=colors['highlight']),
            tickfont=dict(color=colors['highlight']),
            anchor='x',
            overlaying='y',
            side='right'
        ),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='right',
            x=1
        ),
        margin=dict(l=40, r=40, t=60, b=40),
        hovermode='x unified',
        barmode='group',
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create Freelancer Population by Region visualization
def create_population_chart():
    df = data['freelancer_population']
    
    # Pivot the data for better visualization
    pivot_df = df.pivot(index='Year', columns='Region', values='Population_Millions')
    
    fig = px.area(
        pivot_df, 
        title='Freelancer Population by Region (2020-2025)',
        labels={'value': 'Population (Millions)', 'variable': 'Region'},
        color_discrete_sequence=colors['regions']
    )
    
    fig.update_layout(
        xaxis=dict(title='Year', tickmode='linear'),
        yaxis=dict(title='Population (Millions)'),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='right',
            x=1
        ),
        margin=dict(l=40, r=40, t=60, b=40),
        hovermode='x unified',
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create Segment Growth by Freelancer Type visualization
def create_segment_growth_chart():
    df = data['segment_growth']
    
    # Filter for the most recent year
    latest_year = df['Year'].max()
    latest_df = df[df['Year'] == latest_year].sort_values('Growth_Rate_Percent', ascending=False)
    
    fig = px.bar(
        latest_df,
        x='Segment',
        y='Growth_Rate_Percent',
        title=f'Segment Growth Rates by Freelancer Type ({latest_year})',
        labels={'Growth_Rate_Percent': 'Growth Rate (%)', 'Segment': 'Freelancer Type'},
        color='Growth_Rate_Percent',
        color_continuous_scale=px.colors.sequential.Viridis,
        text='Growth_Rate_Percent'
    )
    
    fig.update_traces(
        texttemplate='%{text:.1f}%',
        textposition='outside'
    )
    
    fig.update_layout(
        xaxis=dict(title='Freelancer Type'),
        yaxis=dict(title='Growth Rate (%)'),
        coloraxis_showscale=False,
        margin=dict(l=40, r=40, t=60, b=80),
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create Pain Points Analysis visualization
def create_pain_points_chart():
    df = data['pain_points']
    
    # Create a bubble chart
    fig = px.scatter(
        df,
        x='Frequency',
        y='Severity',
        size='Severity',
        color='Pain_Point',
        text='Pain_Point',
        title='Freelancer Legal Pain Points: Severity vs. Frequency',
        labels={
            'Frequency': 'Frequency (% of Freelancers)',
            'Severity': 'Severity (1-10 Scale)'
        },
        color_discrete_sequence=colors['regions'],
        size_max=30
    )
    
    fig.update_traces(
        textposition='top center',
        marker=dict(line=dict(width=1, color='DarkSlateGrey')),
        selector=dict(mode='markers+text')
    )
    
    fig.update_layout(
        xaxis=dict(title='Frequency (% of Freelancers)', range=[45, 95]),
        yaxis=dict(title='Severity (1-10 Scale)', range=[5.5, 9.5]),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=-0.2,
            xanchor='center',
            x=0.5
        ),
        margin=dict(l=40, r=40, t=60, b=100),
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    # Add quadrant lines and labels
    fig.add_shape(
        type='line',
        x0=70, y0=5.5,
        x1=70, y1=9.5,
        line=dict(color='grey', width=1, dash='dash')
    )
    
    fig.add_shape(
        type='line',
        x0=45, y0=7.5,
        x1=95, y1=7.5,
        line=dict(color='grey', width=1, dash='dash')
    )
    
    # Add quadrant labels
    fig.add_annotation(
        x=57.5, y=8.5,
        text="High Severity,<br>Low Frequency",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    fig.add_annotation(
        x=82.5, y=8.5,
        text="Critical Issues:<br>High Severity,<br>High Frequency",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    fig.add_annotation(
        x=57.5, y=6.5,
        text="Low Priority:<br>Low Severity,<br>Low Frequency",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    fig.add_annotation(
        x=82.5, y=6.5,
        text="Common Issues:<br>Low Severity,<br>High Frequency",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    return fig

# Create Regional Variations in Legal Concerns visualization
def create_regional_concerns_chart():
    df = data['regional_legal_concerns']
    
    # Create a heatmap
    pivot_df = df.pivot(index='Region', columns='Concern', values='Severity')
    
    fig = px.imshow(
        pivot_df,
        title='Regional Variations in Legal Concerns',
        labels=dict(x='Legal Concern', y='Region', color='Severity (1-10)'),
        color_continuous_scale=px.colors.sequential.Viridis,
        text_auto=True,
        aspect='auto'
    )
    
    fig.update_layout(
        margin=dict(l=40, r=40, t=60, b=40),
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create Experience Level vs. Legal Concerns visualization
def create_experience_concerns_chart():
    df = data['experience_vs_concerns']
    
    # Create a heatmap
    pivot_df = df.pivot(index='Experience', columns='Concern', values='Severity')
    
    # Ensure experience levels are in the correct order
    experience_order = [
        'Beginner (0-1 years)', 
        'Intermediate (2-5 years)', 
        'Experienced (6-10 years)', 
        'Expert (10+ years)'
    ]
    pivot_df = pivot_df.reindex(experience_order)
    
    fig = px.imshow(
        pivot_df,
        title='Experience Level vs. Legal Concerns',
        labels=dict(x='Legal Concern', y='Experience Level', color='Severity (1-10)'),
        color_continuous_scale=px.colors.sequential.Viridis,
        text_auto=True,
        aspect='auto'
    )
    
    fig.update_layout(
        margin=dict(l=40, r=40, t=60, b=40),
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create User Demographics visualization
def create_demographics_chart():
    df = data['user_demographics']
    
    # Create a parallel coordinates plot
    dimensions = [
        dict(range=[25, 45], label='Average Age', values=df['Average_Age']),
        dict(range=[0, 100], label='% Male', values=df['Percent_Male']),
        dict(range=[0, 100], label='% Female', values=df['Percent_Female']),
        dict(range=[0, 100], label='% US Based', values=df['Percent_US_Based']),
        dict(range=[0, 100], label='% Europe Based', values=df['Percent_Europe_Based']),
        dict(range=[0, 100], label='% Other Regions', values=df['Percent_Other_Regions']),
        dict(range=[0, 10], label='Avg Experience (Years)', values=df['Average_Experience_Years'])
    ]
    
    fig = go.Figure(data=
        go.Parcoords(
            line=dict(
                color=np.random.randint(0, len(df), size=len(df)),
                colorscale=px.colors.sequential.Viridis,
                showscale=False
            ),
            dimensions=dimensions,
            labelangle=30,
            labelfont=dict(size=12, color=colors['text'])
        )
    )
    
    # Add segment labels
    for i, segment in enumerate(df['Segment']):
        fig.add_annotation(
            x=0,
            y=1.05 + (i * 0.03),
            xref='paper',
            yref='paper',
            text=f"Line {i+1}: {segment}",
            showarrow=False,
            font=dict(size=10)
        )
    
    fig.update_layout(
        title='Freelancer Demographics by Segment',
        margin=dict(l=40, r=40, t=100, b=40),
        height=600,
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create Income Levels and Willingness to Pay visualization
def create_income_willingness_chart():
    df = data['income_willingness']
    
    fig = go.Figure()
    
    # Add bar chart for income
    fig.add_trace(go.Bar(
        x=df['Segment'],
        y=df['Average_Annual_Income_USD'],
        name='Average Annual Income (USD)',
        marker_color=colors['primary'],
        text=df['Average_Annual_Income_USD'].apply(lambda x: f'${x:,.0f}'),
        textposition='auto'
    ))
    
    # Add line chart for willingness to pay
    fig.add_trace(go.Scatter(
        x=df['Segment'],
        y=df['Willingness_To_Pay_Monthly_USD'],
        name='Willingness to Pay Monthly (USD)',
        mode='lines+markers',
        yaxis='y2',
        line=dict(color=colors['highlight'], width=3),
        marker=dict(size=8)
    ))
    
    # Update layout
    fig.update_layout(
        title='Income Levels and Willingness to Pay by Segment',
        xaxis=dict(title='Freelancer Segment'),
        yaxis=dict(
            title='Average Annual Income (USD)',
            title_font=dict(color=colors['primary']),
            tickfont=dict(color=colors['primary'])
        ),
        yaxis2=dict(
            title='Willingness to Pay Monthly (USD)',
            title_font=dict(color=colors['highlight']),
            tickfont=dict(color=colors['highlight']),
            anchor='x',
            overlaying='y',
            side='right',
            range=[0, 60]
        ),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=1.02,
            xanchor='right',
            x=1
        ),
        margin=dict(l=40, r=40, t=60, b=80),
        hovermode='x unified',
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    return fig

# Create Competitive Positioning visualization
def create_competitive_positioning_chart():
    df = data['competitive_positioning']
    
    # Create a bubble chart
    fig = px.scatter(
        df,
        x='Speed_Simplicity',
        y='Legal_Confidence',
        size='Market_Share_Percent',
        color='Category',
        text='Competitor',
        title='Competitive Positioning: Legal Confidence vs. Speed/Simplicity',
        labels={
            'Speed_Simplicity': 'Speed & Simplicity (1-10 Scale)',
            'Legal_Confidence': 'Legal Confidence (1-10 Scale)',
            'Market_Share_Percent': 'Market Share (%)'
        },
        color_discrete_sequence=colors['regions'],
        size_max=40,
        hover_data=['Market_Share_Percent']
    )
    
    fig.update_traces(
        textposition='top center',
        marker=dict(line=dict(width=1, color='DarkSlateGrey')),
        selector=dict(mode='markers+text')
    )
    
    fig.update_layout(
        xaxis=dict(title='Speed & Simplicity (1-10 Scale)', range=[1.5, 9.5]),
        yaxis=dict(title='Legal Confidence (1-10 Scale)', range=[1.5, 9.5]),
        legend=dict(
            orientation='h',
            yanchor='bottom',
            y=-0.2,
            xanchor='center',
            x=0.5
        ),
        margin=dict(l=40, r=40, t=60, b=100),
        plot_bgcolor=colors['background'],
        paper_bgcolor=colors['background'],
        font=dict(color=colors['text'])
    )
    
    # Add quadrant lines and labels
    fig.add_shape(
        type='line',
        x0=5.5, y0=1.5,
        x1=5.5, y1=9.5,
        line=dict(color='grey', width=1, dash='dash')
    )
    
    fig.add_shape(
        type='line',
        x0=1.5, y0=5.5,
        x1=9.5, y1=5.5,
        line=dict(color='grey', width=1, dash='dash')
    )
    
    # Add quadrant labels
    fig.add_annotation(
        x=3.5, y=7.5,
        text="High Confidence,<br>Low Speed",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    fig.add_annotation(
        x=7.5, y=7.5,
        text="Ideal Position:<br>High Confidence,<br>High Speed",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    fig.add_annotation(
        x=3.5, y=3.5,
        text="Low Value:<br>Low Confidence,<br>Low Speed",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    fig.add_annotation(
        x=7.5, y=3.5,
        text="Fast but Risky:<br>Low Confidence,<br>High Speed",
        showarrow=False,
        font=dict(size=10, color="grey")
    )
    
    # Highlight our solution
    our_solution = df[df['Competitor'] == 'Our Solution']
    
    fig.add_shape(
        type='circle',
        xref='x', yref='y',
        x0=our_solution['Speed_Simplicity'].values[0] - 0.3,
        y0=our_solution['Legal_Confidence'].values[0] -<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>