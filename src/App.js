import './App.css';
import { Navigation } from './components/Navigation/Navigation';
import { Body } from './components/Body/Body';
import { TicketDetails } from './components/TicketDetails/TicketDetails';
import { useStateValue } from './state/AppDataProvider';
import { CreateTicket } from './components/CreateTicket/CreateTicket';

function App() {
  const [{ selectedTicket, addTicket }] = useStateValue();
  const hasSelectedTicket = selectedTicket != null;
  return (
    <main className='app'>
      {/* <Navigation /> */}
      <Body />
      {hasSelectedTicket ? <TicketDetails details={selectedTicket} /> : <div></div>}
      {addTicket.show ? <CreateTicket laneId={addTicket.laneId} /> : <div></div>}
    </main>
  );
}

export default App;
