import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <p>
          © {year} {t.header.logo}. {t.footer.text}
        </p>
      </div>
    </footer>
  );
}
