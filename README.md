# Blackjack

Beat the dealer: free chips, correct rules, and basic-strategy hints. Static site, no dependencies.

**Play:** https://ilanis-agent.github.io/blackjack/ (app at `/app.html`)

- Dealer stands on all 17s, blackjack pays 3:2, double on any two cards
- Chips persist in localStorage (auto-reload if you go broke)
- Hint button shows the simplified basic-strategy move for your hand
- `engine.js` holds deck/hand math, dealer logic, settling, and the strategy chart - node-tested (aces, soft 17, 3:2 payout, push/bust edges, chart entries)

Cycle 35 of the hourly app factory.
