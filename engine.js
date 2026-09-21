/* blackjack engine: cards, hands, dealer, settling, basic strategy (pure, node-testable) */
var RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
var SUITS = ['S','H','D','C'];
function makeDeck(){
  var d = [];
  SUITS.forEach(function(s){ RANKS.forEach(function(r){ d.push({r:r, s:s}); }); });
  return d;
}
function shuffle(deck, rng){
  rng = rng || Math.random;
  for (var i=deck.length-1;i>0;i--){
    var j = Math.floor(rng()*(i+1));
    var t=deck[i]; deck[i]=deck[j]; deck[j]=t;
  }
  return deck;
}
function cardVal(r){
  if (r==='A') return 11;
  if (r==='K'||r==='Q'||r==='J'||r==='10') return 10;
  return +r;
}
function handValue(hand){
  var total=0, aces=0;
  hand.forEach(function(c){ total+=cardVal(c.r); if(c.r==='A') aces++; });
  while (total>21 && aces>0){ total-=10; aces--; }
  return { total:total, soft: aces>0 };
}
function isBlackjack(hand){ return hand.length===2 && handValue(hand).total===21; }
function isBust(hand){ return handValue(hand).total>21; }
/* dealer hits until 17, stands on soft 17 */
function dealerShouldHit(hand){
  var v = handValue(hand);
  return v.total < 17;
}
function dealerPlay(hand, deck){
  while (dealerShouldHit(hand)) hand.push(deck.pop());
  return hand;
}
/* returns {result:'win'|'lose'|'push', payout} given bet; blackjack pays 3:2 */
function settle(player, dealer, bet){
  var pb = isBlackjack(player), db = isBlackjack(dealer);
  var pv = handValue(player).total, dv = handValue(dealer).total;
  if (pb && db) return { result:'push', payout:bet };
  if (pb) return { result:'win', payout:bet + Math.floor(bet*1.5), blackjack:true };
  if (db) return { result:'lose', payout:0, blackjack:true };
  if (pv>21) return { result:'lose', payout:0 };
  if (dv>21) return { result:'win', payout:bet*2 };
  if (pv>dv) return { result:'win', payout:bet*2 };
  if (pv<dv) return { result:'lose', payout:0 };
  return { result:'push', payout:bet };
}
/* simplified basic strategy, no splits: returns H, S, or D (double else hit/stand per table) */
function basicStrategy(player, dealerUp){
  var v = handValue(player);
  var up = cardVal(dealerUp.r);
  var canDouble = player.length===2;
  if (v.soft){
    var other = v.total-11;
    if (other>=9) return 'S';
    if (other===8) return 'S';
    if (other===7){ if (up>=3 && up<=6) return canDouble?'D':'S'; if (up>=9) return 'H'; return 'S'; }
    if (other>=4 && other<=6){ if (up>=4 && up<=6) return canDouble?'D':'H'; return 'H'; }
    if (up>=5 && up<=6) return canDouble?'D':'H';
    return 'H';
  }
  var t = v.total;
  if (t>=17) return 'S';
  if (t>=13 && t<=16){ return up<=6 ? 'S' : 'H'; }
  if (t===12){ return (up>=4 && up<=6) ? 'S' : 'H'; }
  if (t===11){ return canDouble ? 'D' : 'H'; }
  if (t===10){ return up<=9 ? (canDouble?'D':'H') : 'H'; }
  if (t===9){ return (up>=3 && up<=6) ? (canDouble?'D':'H') : 'H'; }
  return 'H';
}
if (typeof module !== 'undefined' && module.exports){
  module.exports = { RANKS:RANKS, SUITS:SUITS, makeDeck:makeDeck, shuffle:shuffle, cardVal:cardVal, handValue:handValue, isBlackjack:isBlackjack, isBust:isBust, dealerShouldHit:dealerShouldHit, dealerPlay:dealerPlay, settle:settle, basicStrategy:basicStrategy };
}
