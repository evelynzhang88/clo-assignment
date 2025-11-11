Contents Filter
1. Pricing Option
a. There are three options: Paid, Free, and View Only
b. The default state should be unchecked, and when all options are unchecked,
all data (Content List) should be displayed.
c. Content List should be filtered based on the selected Pricing Option(s).
(e.g., If Paid is selected, only Paid content should be shown.)
2. d. Multiple Pricing Options can be selected at once.
Clicking the Reset Button should restore the default state.
Contents List
1. 2. 3. Display each item’s photo, user name, title, and the Pricing Option (Free/View
Only), and for Paid items, the price should be shown.
Implement Infinite scrolling by splitting the list retrieved from the provided API into
chunks. You can decide the chunk size as needed.
Apply a Grid system that adjusts based on the device width:
a. Default (Over 1200px): 4 columns
b. Below 1200px: 3 columns
c. Below 768px: 2 columns
d. Below 480px: 1 column
Keyword Search
1. 2. 3. Filter the list based on a Keyword search (e.g., searching "Anisha" should filter
content that includes "Anisha" in the user name or title).
If no keyword is entered, all items should be displayed.
Keyword searches should be combinable with Pricing Option filters.
(e.g., searching for "Anisha" and selecting Paid should filter content that is both
Paid and related to "Anisha.")
State Persistence
Keep the current filters and search results persistent after page refresh, but avoid using
any browser storage to implement this.