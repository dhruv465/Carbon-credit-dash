import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from '../App'

// Mock the sample data
vi.mock('../assets/sample.json', () => ({
  sampleCredits: [
    {
      unic_id: "UNIC-VCS-IND-2023-4F7A8C1B",
      project_name: "Mangrove Restoration Project",
      vintage: 2023,
      status: "Active"
    },
    {
      unic_id: "UNIC-GS-IND-2022-8A1B2C3D", 
      project_name: "Solar Power Plant Maharashtra",
      vintage: 2022,
      status: "Retired"
    }
  ]
}))

describe('Basic Dashboard Integration', () => {
  it('should render the dashboard with all main components', async () => {
    render(<App />)
    
    // Check that main elements are present
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
    }, { timeout: 5000 })
    
    // Check that search functionality is present
    expect(screen.getByPlaceholderText(/Search credits/i)).toBeInTheDocument()
    
    // Check that view mode buttons are present
    expect(screen.getByRole('button', { name: /card view/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /table view/i })).toBeInTheDocument()
  })

  it('should display credit cards with correct information', async () => {
    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
    })
    
    // Check that UNIC IDs are displayed
    expect(screen.getByText('UNIC-VCS-IND-2023-4F7A8C1B')).toBeInTheDocument()
    expect(screen.getByText('UNIC-GS-IND-2022-8A1B2C3D')).toBeInTheDocument()
    
    // Check that vintages are displayed
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    
    // Check that status badges are displayed
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Retired')).toBeInTheDocument()
  })
})