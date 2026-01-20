## Testing Result

### Iteration 3
- **Status**: Complete
- **Description**: Features Expansion (Discounts, Loyalty, Order Again).
- **Backend Tests**:
    - `POST /api/discounts/validate`: Tested with 'START10', 'PLN50'. Working.
    - `GET /api/loyalty/status`: Tested logic. Returns proper level based on spent.
- **Frontend Tests**:
    - **Checkout**: Discount input works, updates total correctly.
    - **My Orders**: Shows "Level: Boss" card properly.
    - **Order Status**: "Zamów ponownie" button works (adds to cart).
- **User Feedback**: "Leć jak najbardziej się da" - implemented all requested high-prio features.
