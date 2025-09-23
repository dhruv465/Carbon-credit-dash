# Manual Integration Test Checklist

This checklist verifies that all components are properly integrated and the complete dashboard workflow functions correctly.

## ✅ Initial Dashboard Load (Requirements 1.1, 1.2, 1.3, 1.4)

### Dashboard Layout
- [ ] Dashboard loads within 2 seconds
- [ ] Header with title "Carbon Credits Dashboard" is visible
- [ ] Dashboard statistics show correct counts (Total, Active, Retired credits)
- [ ] Credit cards are displayed in responsive grid layout
- [ ] Search bar is present and functional
- [ ] Filter dropdowns (Status, Vintage) are present
- [ ] View mode toggle buttons (Card View, Table View) are present

### Credit Cards Display
- [ ] All credit cards show UNIC ID, project name, vintage, and status
- [ ] Status badges are color-coded (green for Active, gray for Retired)
- [ ] "View Details" and "Download Certificate" buttons are present on each card
- [ ] Cards have hover effects and proper spacing

### Responsive Design (Requirement 1.4)
- [ ] **Desktop (1200px+)**: 3-4 column grid layout
- [ ] **Tablet (768px-1024px)**: 2-3 column grid layout  
- [ ] **Mobile (320px-640px)**: Single column layout
- [ ] Button text adapts: "Card View"/"Table View" on desktop, "Cards"/"Table" on mobile
- [ ] Touch targets are appropriately sized (44px minimum) on mobile

## ✅ Search Functionality (Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6)

### Real-time Search
- [ ] Search by project name filters results immediately
- [ ] Search by UNIC ID filters results immediately
- [ ] Search is case-insensitive
- [ ] Search results update with debouncing (no lag)
- [ ] Clear search restores full list

### No Results Handling
- [ ] Searching for non-existent term shows "No credits found" message
- [ ] Empty state includes clear filters option
- [ ] Result count displays correctly (e.g., "Showing 2 of 10 credits")

## ✅ Filter Functionality (Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6)

### Status Filter
- [ ] "All" option shows all credits
- [ ] "Active" option shows only active credits
- [ ] "Retired" option shows only retired credits
- [ ] Filter dropdown shows current selection

### Vintage Filter
- [ ] "All" option shows all credits
- [ ] Specific year options filter correctly
- [ ] Available years are dynamically populated from data
- [ ] Filter dropdown shows current selection

### Combined Filters
- [ ] Search + Status filter work together
- [ ] Search + Vintage filter work together
- [ ] Status + Vintage filter work together
- [ ] All three filters work together
- [ ] "Clear Filters" button resets all filters and search

## ✅ View Mode Toggle (Requirements 1.1, 1.3, 6.1, 6.2)

### Card View
- [ ] Card view is default mode
- [ ] Cards display in responsive grid
- [ ] All card information is visible
- [ ] Hover effects work properly

### Table View
- [ ] Table view shows all credit information in columns
- [ ] Table is sortable by columns
- [ ] Table is responsive and scrollable on mobile
- [ ] Pagination works if implemented

### Mode Persistence
- [ ] Filters are maintained when switching view modes
- [ ] Search query is maintained when switching view modes
- [ ] View mode preference could be remembered (optional)

## ✅ Credit Details Modal (Requirements 5.1, 5.2, 5.3, 5.5)

### Modal Functionality
- [ ] Clicking "View Details" opens modal
- [ ] Modal displays all credit information
- [ ] Modal has proper close button (X)
- [ ] Modal can be closed by clicking outside (optional)
- [ ] Modal can be closed with Escape key

### Modal Content
- [ ] UNIC ID is prominently displayed
- [ ] Project name is clearly shown
- [ ] Vintage year is displayed
- [ ] Status badge is shown with correct color
- [ ] "Download Certificate" button is present in modal

### Responsive Modal
- [ ] Modal is properly sized on desktop
- [ ] Modal adapts to mobile screens (full-screen or bottom sheet)
- [ ] Modal content is scrollable if needed

## ✅ Certificate Download Workflow (Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 5.4)

### Certificate Dialog
- [ ] Clicking "Download Certificate" opens certificate preview dialog
- [ ] Certificate preview shows professional layout
- [ ] Certificate includes UNIC ID, project name, vintage, status
- [ ] Certificate includes timestamp of generation
- [ ] Certificate has proper branding/styling

### Download Options
- [ ] "Download HTML" button generates HTML file
- [ ] "Download PDF" button generates PDF file
- [ ] Downloaded files have descriptive names (include UNIC ID)
- [ ] Downloads work from both credit card and details modal

### Certificate Content Verification
- [ ] Certificate contains all required information
- [ ] Timestamp is current and properly formatted
- [ ] Certificate layout is professional and readable
- [ ] PDF generation works without errors

## ✅ Performance Optimizations (Requirements 6.1, 6.2, 6.3, 6.5)

### Loading States
- [ ] Initial load shows skeleton/loading animation
- [ ] Search shows loading state during filtering
- [ ] Certificate generation shows loading state
- [ ] No blank screens during transitions

### Performance Metrics
- [ ] Dashboard loads within 2 seconds on standard connection
- [ ] Search results appear within 500ms
- [ ] Smooth scrolling and interactions
- [ ] No noticeable lag when switching view modes

### Large Dataset Handling
- [ ] Virtual scrolling activates for 100+ items
- [ ] Performance remains smooth with large datasets
- [ ] Memory usage stays reasonable during extended use

## ✅ Error Handling (Requirements 6.1, 6.5)

### Network Errors
- [ ] Data loading errors show retry button
- [ ] Offline state is detected and displayed
- [ ] Retry functionality works correctly
- [ ] Error messages are user-friendly

### Certificate Errors
- [ ] Certificate generation errors show toast notifications
- [ ] Failed downloads can be retried
- [ ] Error messages are specific and helpful

### Graceful Degradation
- [ ] App doesn't crash on errors
- [ ] Error boundaries catch component errors
- [ ] User can continue using other features after errors

## ✅ Accessibility (Requirements 7.1, 7.2, 7.3, 7.4, 7.5)

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are clearly visible
- [ ] Enter/Space keys activate buttons
- [ ] Escape key closes modals

### Screen Reader Support
- [ ] Proper ARIA labels on all interactive elements
- [ ] Landmark roles (banner, main, search) are present
- [ ] Status updates are announced
- [ ] Form controls have associated labels

### Visual Accessibility
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Information isn't conveyed by color alone
- [ ] Text is readable at 200% zoom
- [ ] Focus indicators are visible

### Assistive Technology
- [ ] Screen reader can navigate all content
- [ ] Voice control software can activate elements
- [ ] High contrast mode is supported

## ✅ Cross-Browser Compatibility

### Modern Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet (Android)

## ✅ End-to-End Workflows

### Complete Search Workflow
1. [ ] Load dashboard
2. [ ] Search for specific project
3. [ ] Apply status filter
4. [ ] Apply vintage filter
5. [ ] Clear all filters
6. [ ] Verify all steps work smoothly

### Complete Certificate Workflow
1. [ ] Find specific credit
2. [ ] Click "Download Certificate"
3. [ ] Preview certificate in dialog
4. [ ] Download as HTML
5. [ ] Download as PDF
6. [ ] Verify files are correct

### Complete Details Workflow
1. [ ] Click "View Details" on credit card
2. [ ] Review all information in modal
3. [ ] Click "Download Certificate" from modal
4. [ ] Complete certificate download
5. [ ] Close all dialogs

### Responsive Workflow
1. [ ] Test on desktop (1200px+)
2. [ ] Test on tablet (768px)
3. [ ] Test on mobile (375px)
4. [ ] Verify all features work at each breakpoint
5. [ ] Test orientation changes

## Test Results Summary

**Date:** ___________
**Tester:** ___________
**Browser:** ___________
**Device:** ___________

**Overall Status:** 
- [ ] ✅ All tests passed
- [ ] ⚠️ Minor issues found (list below)
- [ ] ❌ Major issues found (list below)

**Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Notes:**
_________________________________
_________________________________
_________________________________