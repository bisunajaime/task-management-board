import './App.css';
import { Navigation } from './components/Navigation/Navigation';
import { Body } from './components/Body/Body';
import { TicketDetails } from './components/TicketDetails/TicketDetails';
import { useStateValue } from './state/AppDataProvider';

function App() {
  const [{ selectedTicket }] = useStateValue();
  const hasSelectedTicket = selectedTicket != null;
  return (
    <main className='app'>
      <Navigation />
      <Body />
      {hasSelectedTicket ? <TicketDetails details={selectedTicket} /> : <div></div>}
    </main>
  );
}

export default App;
