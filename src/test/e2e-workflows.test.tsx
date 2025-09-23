import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock sample data
const mockCredits = [
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
  },
  {
    unic_id: "UNIC-VCS-BRA-2021-9E2F3A4B",
    project_name: "Amazon Rainforest Conservation",
    vintage: 2021,
    status: "Active"
  },
  {
    unic_id: "UNIC-GS-KEN-2020-1A2B3C4D",
    project_name: "Wind Farm Kenya",
    vintage: 2020,
    status: "Retired"
  }
]

vi.mock('../assets/sample.json', () => ({
  sampleCredits: mockCredits
}))

vi.mock('html2pdf.js', () => ({
  default: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    save: vi.fn().mockResolvedValue(undefined),
  }))
}))

describe('End-to-End Workflow Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Search and Filter Workflow', () => {
    it('should handle complex search and filter combinations', async () => {
      render(<App />)
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Step 1: Search for "Solar"
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Solar')
      
      await waitFor(() => {
        expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
        expect(screen.queryByText('Mangrove Restoration Project')).not.toBeInTheDocument()
      })
      
      // Step 2: Clear search and apply status filter
      await user.clear(searchInput)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Apply Active status filter
      const statusFilter = screen.getByRole('button', { name: /status/i })
      await user.click(statusFilter)
      
      const activeOption = screen.getByRole('option', { name: /^Active$/i })
      await user.click(activeOption)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.getByText('Amazon Rainforest Conservation')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
      
      // Step 3: Add vintage filter on top of status filter
      const vintageFilter = screen.getByRole('button', { name: /vintage/i })
      await user.click(vintageFilter)
      
      const vintage2023 = screen.getByRole('option', { name: /2023/i })
      await user.click(vintage2023)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Amazon Rainforest Conservation')).not.toBeInTheDocument()
      })
      
      // Step 4: Clear all filters
      const clearButton = screen.getByRole('button', { name: /clear filters/i })
      await user.click(clearButton)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
        expect(screen.getByText('Amazon Rainforest Conservation')).toBeInTheDocument()
      })
    })
  })

  describe('Complete Certificate Download Workflow', () => {
    it('should handle the full certificate generation and download process', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Step 1: Click download certificate from credit card
      const creditCard = screen.getByText('Mangrove Restoration Project').closest('article')
      const downloadButton = within(creditCard!).getByRole('button', { name: /download certificate/i })
      await user.click(downloadButton)
      
      // Step 2: Verify certificate dialog opens with correct content
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText(/Certificate Preview/i)).toBeInTheDocument()
      })
      
      // Verify certificate content
      expect(screen.getByText('UNIC-VCS-IND-2023-4F7A8C1B')).toBeInTheDocument()
      expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      expect(screen.getByText('2023')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
      
      // Step 3: Test HTML download
      const downloadHTMLButton = screen.getByRole('button', { name: /download html/i })
      await user.click(downloadHTMLButton)
      
      // Should trigger HTML download (mocked)
      await waitFor(() => {
        // Verify download was triggered
        expect(URL.createObjectURL).toHaveBeenCalled()
      })
      
      // Step 4: Test PDF download
      const downloadPDFButton = screen.getByRole('button', { name: /download pdf/i })
      await user.click(downloadPDFButton)
      
      // Should trigger PDF generation
      await waitFor(() => {
        expect(vi.mocked(require('html2pdf.js').default)).toHaveBeenCalled()
      })
      
      // Step 5: Close dialog
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })

    it('should handle certificate download from details modal', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Step 1: Open credit details
      const creditCard = screen.getByText('Mangrove Restoration Project').closest('article')
      const viewDetailsButton = within(creditCard!).getByRole('button', { name: /view details/i })
      await user.click(viewDetailsButton)
      
      // Step 2: Verify details modal opens
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByText('Credit Details')).toBeInTheDocument()
      })
      
      // Step 3: Click download certificate from details modal
      const downloadFromDetails = screen.getByRole('button', { name: /download certificate/i })
      await user.click(downloadFromDetails)
      
      // Step 4: Should close details and open certificate dialog
      await waitFor(() => {
        expect(screen.getByText(/Certificate Preview/i)).toBeInTheDocument()
      })
      
      // Verify certificate content is correct
      expect(screen.getByText('UNIC-VCS-IND-2023-4F7A8C1B')).toBeInTheDocument()
    })
  })

  describe('View Mode Switching Workflow', () => {
    it('should maintain filters when switching between view modes', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Step 1: Apply search filter
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Mangrove')
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
      
      // Step 2: Switch to table view
      const tableViewButton = screen.getByRole('button', { name: /table view/i })
      await user.click(tableViewButton)
      
      // Step 3: Verify filter is maintained in table view
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument()
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
      
      // Step 4: Switch back to card view
      const cardViewButton = screen.getByRole('button', { name: /card view/i })
      await user.click(cardViewButton)
      
      // Step 5: Verify filter is still maintained
      await waitFor(() => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
    })
  })

  describe('Responsive Behavior Workflow', () => {
    it('should adapt interface for different screen sizes', async () => {
      // Test desktop view
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      })
      
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Should show full button text on desktop
      expect(screen.getByText('Card View')).toBeInTheDocument()
      expect(screen.getByText('Table View')).toBeInTheDocument()
      
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      
      // Trigger resize event
      fireEvent(window, new Event('resize'))
      
      // Should adapt to mobile layout
      await waitFor(() => {
        // Mobile should show abbreviated button text
        expect(screen.getByText('Cards')).toBeInTheDocument()
        expect(screen.getByText('Table')).toBeInTheDocument()
      })
    })
  })

  describe('Error Recovery Workflow', () => {
    it('should handle network errors and recovery gracefully', async () => {
      // Mock network failure
      const mockFetch = vi.spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('Network error'))
      
      render(<App />)
      
      // Step 1: Should show error state
      await waitFor(() => {
        expect(screen.getByText(/Error Loading Dashboard/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
      })
      
      // Step 2: Mock successful retry
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ sampleCredits: mockCredits })
      } as Response)
      
      // Step 3: Click retry
      const retryButton = screen.getByRole('button', { name: /try again/i })
      await user.click(retryButton)
      
      // Step 4: Should recover and show data
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText(/Error Loading Dashboard/i)).not.toBeInTheDocument()
      })
      
      // Step 5: Should be fully functional after recovery
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Solar')
      
      await waitFor(() => {
        expect(screen.getByText('Solar Power Plant Maharashtra')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility Workflow', () => {
    it('should support complete keyboard navigation workflow', async () => {
      render(<App />)
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
      })
      
      // Step 1: Tab to search input
      await user.tab()
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      expect(document.activeElement).toBe(searchInput)
      
      // Step 2: Type search query
      await user.type(searchInput, 'Mangrove')
      
      await waitFor(() => {
        expect(screen.getByText('Mangrove Restoration Project')).toBeInTheDocument()
        expect(screen.queryByText('Solar Power Plant Maharashtra')).not.toBeInTheDocument()
      })
      
      // Step 3: Tab to view mode buttons
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /card view/i }))
      
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: /table view/i }))
      
      // Step 4: Navigate to credit card actions
      await user.tab()
      await user.tab()
      await user.tab()
      
      // Should be able to activate buttons with keyboard
      const activeElement = document.activeElement as HTMLElement
      expect(activeElement.tagName).toBe('BUTTON')
      
      // Step 5: Test Enter key activation
      await user.keyboard('{Enter}')
      
      // Should trigger appropriate action (details or certificate)
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('should provide proper screen reader support', async () => {
      render(<App />)
      
      // Check ARIA landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByLabelText('Carbon Credits Dashboard')).toBeInTheDocument()
      
      await waitFor(() => {
        // Check credit cards have proper ARIA labels
        const creditCards = screen.getAllByRole('article')
        expect(creditCards.length).toBeGreaterThan(0)
        
        creditCards.forEach(card => {
          expect(card).toHaveAttribute('aria-label')
        })
      })
      
      // Check form controls have labels
      expect(screen.getByLabelText(/Search credits/i)).toBeInTheDocument()
      
      // Check buttons have accessible names
      expect(screen.getByRole('button', { name: /card view/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /table view/i })).toBeInTheDocument()
    })
  })

  describe('Performance Workflow', () => {
    it('should handle large dataset efficiently with virtual scrolling', async () => {
      // Mock large dataset
      const largeDataset = Array.from({ length: 200 }, (_, i) => ({
        unic_id: `UNIC-PERF-${i.toString().padStart(3, '0')}`,
        project_name: `Performance Test Project ${i}`,
        vintage: 2020 + (i % 4),
        status: i % 2 === 0 ? 'Active' : 'Retired' as const
      }))
      
      vi.doMock('../assets/sample.json', () => ({
        sampleCredits: largeDataset
      }))
      
      render(<App />)
      
      // Should load and show virtual scrolling for large datasets
      await waitFor(() => {
        expect(screen.getByText('Performance Test Project 0')).toBeInTheDocument()
      })
      
      // Should use virtual scrolling component
      const virtualGrid = screen.getByRole('main').querySelector('[class*="virtual"]')
      expect(virtualGrid).toBeInTheDocument()
      
      // Search should still be performant
      const searchInput = screen.getByPlaceholderText(/Search credits/i)
      await user.type(searchInput, 'Project 1')
      
      // Should filter efficiently
      await waitFor(() => {
        expect(screen.getByText('Performance Test Project 1')).toBeInTheDocument()
        expect(screen.queryByText('Performance Test Project 0')).not.toBeInTheDocument()
      })
    })
  })
})