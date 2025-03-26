from dash import Input, Output, callback
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# Define callback functions for interactive features

@callback(
    Output('market-size-chart', 'figure'),
    [Input('region-filter', 'value')]
)
def update_market_size_chart(region):
    # This is a placeholder for region-specific market size data
    # In a real implementation, you would filter the data based on the region
    from dashboard import create_market_size_chart, data
    return create_market_size_chart()

@callback(
    Output('population-chart', 'figure'),
    [Input('region-filter', 'value')]
)
def update_population_chart(region):
    from dashboard import create_population_chart, data
    
    df = data['freelancer_population']
    
    if region != 'all':
        # If a specific region is selected, highlight it
        pivot_df = df.pivot(index='Year', columns='Region', values='Population_Millions')
        
        # Create a custom color sequence that highlights the selected region
        from dashboard import colors
        color_sequence = []
        for r in pivot_df.columns:
            if r == region:
                color_sequence.append(colors['highlight'])
            else:
                color_sequence.append('lightgrey')
        
        fig = px.area(
            pivot_df, 
            title=f'Freelancer Population: Focus on {region} (2020-2025)',
            labels={'value': 'Population (Millions)', 'variable': 'Region'},
            color_discrete_sequence=color_sequence
        )
    else:
        # If all regions are selected, use the default chart
        fig = create_population_chart()
    
    return fig

@callback(
    Output('segment-growth-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_segment_growth_chart(segment):
    from dashboard import create_segment_growth_chart, data, colors
    
    df = data['segment_growth']
    
    # Filter for the most recent year
    latest_year = df['Year'].max()
    latest_df = df[df['Year'] == latest_year].sort_values('Growth_Rate_Percent', ascending=False)
    
    if segment != 'all':
        # If a specific segment is selected, highlight it
        color_vals = []
        for s in latest_df['Segment']:
            if s == segment:
                color_vals.append(colors['highlight'])
            else:
                color_vals.append('lightgrey')
        
        fig = px.bar(
            latest_df,
            x='Segment',
            y='Growth_Rate_Percent',
            title=f'Segment Growth Rates: Focus on {segment} ({latest_year})',
            labels={'Growth_Rate_Percent': 'Growth Rate (%)', 'Segment': 'Freelancer Type'},
            color_discrete_sequence=color_vals,
            text='Growth_Rate_Percent'
        )
    else:
        # If all segments are selected, use the default chart
        fig = create_segment_growth_chart()
    
    return fig

@callback(
    Output('pain-points-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_pain_points_chart(segment):
    # This is a placeholder for segment-specific pain points data
    # In a real implementation, you would filter the data based on the segment
    from dashboard import create_pain_points_chart
    return create_pain_points_chart()

@callback(
    Output('regional-concerns-chart', 'figure'),
    [Input('region-filter', 'value')]
)
def update_regional_concerns_chart(region):
    from dashboard import create_regional_concerns_chart, data
    
    df = data['regional_legal_concerns']
    
    if region != 'all':
        # If a specific region is selected, filter the data
        filtered_df = df[df['Region'] == region]
        
        # Create a bar chart instead of a heatmap for a single region
        fig = px.bar(
            filtered_df,
            x='Concern',
            y='Severity',
            title=f'Legal Concerns in {region}',
            labels={'Severity': 'Severity (1-10)', 'Concern': 'Legal Concern'},
            color='Severity',
            color_continuous_scale=px.colors.sequential.Viridis,
            text='Severity'
        )
        
        fig.update_traces(
            texttemplate='%{text:.1f}',
            textposition='outside'
        )
        
        fig.update_layout(
            xaxis=dict(tickangle=45),
            yaxis=dict(range=[0, 10]),
            coloraxis_showscale=False,
            margin=dict(l=40, r=40, t=60, b=120),
            plot_bgcolor='#F9F9F9',
            paper_bgcolor='#F9F9F9',
            font=dict(color='#333333')
        )
    else:
        # If all regions are selected, use the default chart
        fig = create_regional_concerns_chart()
    
    return fig

@callback(
    Output('experience-concerns-chart', 'figure'),
    [Input('experience-filter', 'value')]
)
def update_experience_concerns_chart(experience):
    from dashboard import create_experience_concerns_chart, data
    
    df = data['experience_vs_concerns']
    
    if experience != 'all':
        # If a specific experience level is selected, filter the data
        filtered_df = df[df['Experience'] == experience]
        
        # Create a bar chart instead of a heatmap for a single experience level
        fig = px.bar(
            filtered_df,
            x='Concern',
            y='Severity',
            title=f'Legal Concerns for {experience} Freelancers',
            labels={'Severity': 'Severity (1-10)', 'Concern': 'Legal Concern'},
            color='Severity',
            color_continuous_scale=px.colors.sequential.Viridis,
            text='Severity'
        )
        
        fig.update_traces(
            texttemplate='%{text:.1f}',
            textposition='outside'
        )
        
        fig.update_layout(
            xaxis=dict(tickangle=45),
            yaxis=dict(range=[0, 10]),
            coloraxis_showscale=False,
            margin=dict(l=40, r=40, t=60, b=120),
            plot_bgcolor='#F9F9F9',
            paper_bgcolor='#F9F9F9',
            font=dict(color='#333333')
        )
    else:
        # If all experience levels are selected, use the default chart
        fig = create_experience_concerns_chart()
    
    return fig

@callback(
    Output('demographics-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_demographics_chart(segment):
    # This is a placeholder for segment-specific demographics data
    # In a real implementation, you would filter the data based on the segment
    from dashboard import create_demographics_chart
    return create_demographics_chart()

@callback(
    Output('income-willingness-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_income_willingness_chart(segment):
    from dashboard import create_income_willingness_chart, data, colors
    
    df = data['income_willingness']
    
    if segment != 'all':
        # If a specific segment is selected, filter the data
        filtered_df = df[df['Segment'] == segment]
        
        fig = go.Figure()
        
        # Add bar chart for income
        fig.add_trace(go.Bar(
            x=filtered_df['Segment'],
            y=filtered_df['Average_Annual_Income_USD'],
            name='Average Annual Income (USD)',
            marker_color=colors['primary'],
            text=filtered_df['Average_Annual_Income_USD'].apply(lambda x: f'${x:,.0f}'),
            textposition='auto'
        ))
        
        # Add bar chart for willingness to pay
        fig.add_trace(go.Bar(
            x=filtered_df['Segment'],
            y=filtered_df['Willingness_To_Pay_Monthly_USD'],
            name='Willingness to Pay Monthly (USD)',
            marker_color=colors['highlight'],
            text=filtered_df['Willingness_To_Pay_Monthly_USD'].apply(lambda x: f'${x:.0f}'),
            textposition='auto'
        ))
        
        # Update layout
        fig.update_layout(
            title=f'Income and Willingness to Pay: {segment}',
            xaxis=dict(title='Freelancer Segment'),
            yaxis=dict(title='USD'),
            legend=dict(
                orientation='h',
                yanchor='bottom',
                y=1.02,
                xanchor='right',
                x=1
            ),
            margin=dict(l=40, r=40, t=60, b=40),
            barmode='group',
            plot_bgcolor='#F9F9F9',
            paper_bgcolor='#F9F9F9',
            font=dict(color='#333333')
        )
    else:
        # If all segments are selected, use the default chart
        fig = create_income_willingness_chart()
    
    return fig

@callback(
    Output('competitive-positioning-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_competitive_positioning_chart(segment):
    # This is a placeholder for segment-specific competitive positioning data
    # In a real implementation, you would filter the data based on the segment
    from dashboard import create_competitive_positioning_chart
    return create_competitive_positioning_chart()

@callback(
    Output('feature-comparison-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_feature_comparison_chart(segment):
    # This is a placeholder for segment-specific feature comparison data
    # In a real implementation, you would filter the data based on the segment
    from dashboard import create_feature_comparison_chart
    return create_feature_comparison_chart()

@callback(
    Output('pricing-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_pricing_chart(segment):
    # This is a placeholder for segment-specific pricing data
    # In a real implementation, you would filter the data based on the segment
    from dashboard import create_pricing_chart
    return create_pricing_chart()

@callback(
    Output('addressable-market-chart', 'figure'),
    [Input('region-filter', 'value')]
)
def update_addressable_market_chart(region):
    from dashboard import create_addressable_market_chart, data, colors
    
    df = data['addressable_market']
    
    if region != 'all':
        # If a specific region is selected, filter the data
        filtered_df = df[df['Region'] == region]
        
        fig = go.Figure()
        
        # Add bar chart for total addressable market
        fig.add_trace(go.Bar(
            x=filtered_df['Region'],
            y=filtered_df['Total_Addressable_Market_Millions_USD'],
            name='Total Addressable Market (Millions USD)',
            marker_color=colors['primary'],
            text=filtered_df['Total_Addressable_Market_Millions_USD'].apply(lambda x: f'${x:.0f}M'),
            textposition='auto'
        ))
        
        # Add details as annotations
        fig.add_annotation(
            x=0.5,
            y=0.5,
            xref='paper',
            yref='paper',
            text=f"<b>{region} Market Details:</b><br>" +
                 f"Total Freelancers: {filtered_df['Total_Freelancers_Millions'].values[0]:.1f}M<br>" +
                 f"Addressable %: {filtered_df['Addressable_Percent'].values[0]:.1f}%<br>" +
                 f"Avg Revenue Per User: ${filtered_df['Avg_Annual_Revenue_Per_User_USD'].values[0]:.0f}<br>" +
                 f"Addressable Freelancers: {filtered_df['Addressable_Freelancers_Millions'].values[0]:.2f}M",
            showarrow=False,
            bordercolor='#C7C7C7',
            borderwidth=1,
            borderpad=5,
            bgcolor='#F9F9F9',
            opacity=0.8
        )
        
        # Update layout
        fig.update_layout(
            title=f'Addressable Market in {region}',
            xaxis=dict(title='Region'),
            yaxis=dict(title='Total Addressable Market (Millions USD)'),
            margin=dict(l=40, r=40, t=60, b=40),
            plot_bgcolor='#F9F9F9',
            paper_bgcolor='#F9F9F9',
            font=dict(color='#333333')
        )
    else:
        # If all regions are selected, use the default chart
        fig = create_addressable_market_chart()
    
    return fig

@callback(
    Output('conversion-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_conversion_chart(segment):
    from dashboard import create_conversion_chart, data, colors
    
    df = data['conversion_data']
    
    if segment != 'all':
        # If a specific segment is selected, filter the data
        filtered_df = df[df['Segment'] == segment]
        
        # Create a bar chart for a single segment
        stages = ['Awareness_Rate_Percent', 'Trial_Rate_Percent', 'Conversion_Rate_Percent', 'Retention_Rate_Percent']
        stage_names = ['Awareness', 'Trial', 'Conversion', 'Retention']
        
        fig = go.Figure()
        
        for i, stage in enumerate(stages):
            fig.add_trace(go.Bar(
                x=[stage_names[i]],
                y=[filtered_df[stage].values[0]],
                name=stage_names[i],
                text=[f"{filtered_df[stage].values[0]}%"],
                textposition='auto',
                marker_color=colors['regions'][i % len(colors['regions'])]
            ))
        
        # Update layout
        fig.update_layout(
            title=f'Conversion Funnel for {segment}',
            xaxis=dict(title='Funnel Stage'),
            yaxis=dict(title='Percentage', range=[0, 100]),
            legend=dict(
                orientation='h',
                yanchor='bottom',
                y=1.02,
                xanchor='right',
                x=1
            ),
            margin=dict(l=40, r=40, t=60, b=40),
            plot_bgcolor='#F9F9F9',
            paper_bgcolor='#F9F9F9',
            font=dict(color='#333333')
        )
    else:
        # If all segments are selected, use the default chart
        fig = create_conversion_chart()
    
    return fig

@callback(
    Output('revenue-projection-chart', 'figure'),
    [Input('segment-filter', 'value')]
)
def update_revenue_projection_chart(segment):
    # This is a placeholder for segment-specific revenue projection data
    # In a real implementation, you would filter the data based on the segment
    from dashboard import create_revenue_projection_chart
    return create_revenue_projection_chart()

@callback(
    Output('opportunity-snapshot', 'figure'),
    [Input('region-filter', 'value'), 
     Input('segment-filter', 'value'),
     Input('experience-filter', 'value')]
)
def update_opportunity_snapshot(region, segment, experience):
    from dashboard import create_opportunity_snapshot, colors, go
    
    # Create a dynamic opportunity snapshot based on filters
    region_text = region if region != 'all' else 'Global'
    segment_text = segment if segment != 'all' else 'All Segments'
    experience_text = experience if experience != 'all' else 'All Experience Levels'
    
    # Create a summary figure with key metrics
    fig = go.Figure()
    
    # Add a table with key metrics
    fig.add_trace(go.Table(
        header=dict(
            values=['Metric', 'Value', 'Insight'],
            fill_color=colors['primary'],
            align='left',
            font=dict(color='white', size=12)
        ),
        cells=dict(
            values=[
                [
                    'Selected Region',
                    'Selected Segment',
                    'Selected Experience',
                    'Global Market Size (2025)',
                    'Top Pain Point',
                    'Competitive Position'
                ],
                [
                    region_text,
                    segment_text,
                    experience_text,
                    '$500B+',
                    'Payment Problems (9.2/10)',
                    'High Confidence, High Speed'
                ],
                [
                    f"Filter applied: {region != 'all'}",
                    f"Filter applied: {segment != 'all'}",
                    f"Filter applied: {experience != 'all'}",
                    'Growing at 8% annually',
                    'Affects 82% of freelancers',
       <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>