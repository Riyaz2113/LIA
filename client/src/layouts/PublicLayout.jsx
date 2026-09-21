import { Outlet } from 'react-router-dom';
import Header from '../components/public/Header';
import Footer from '../components/public/Footer';

/**
 * PublicLayout
 * Wraps all public-facing routes (Home, About, Academics, etc.)
 * with the permanently fixed LIA Header and Footer.
 */
const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Header />
      <main className="public-main" style={{ paddingTop: '68px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
