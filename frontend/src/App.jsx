import { UserContextProvider } from './context/UserContext';
import Routes from './Routes';

function App() {
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;

