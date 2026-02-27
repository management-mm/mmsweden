import Sprite from './Sprite';
import './globals.css';
import Providers from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-main font-inter">
        <Sprite />
        <Providers>
          {children}
          <div id="modal-root"></div>
        </Providers>
      </body>
    </html>
  );
}