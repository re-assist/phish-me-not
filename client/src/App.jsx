import Dashboard from './pages/Dashboard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-10">
      
      {/* Global Header */}
      <Header />

      {/* Main Content Area - flex-grow pushes footer down */}
      <div className="max-w-6xl w-full mx-auto grow">
        <Dashboard />
      </div>

      {/* Global Footer */}
      <Footer/>
    </div>
  );
};

export default App;