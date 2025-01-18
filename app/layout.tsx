import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={navStyle}>
          <ul style={navListStyle}>
            <li style={navItemStyle}>
              <Link href="/">Home</Link>
            </li>
            <li style={navItemStyle}>
              <Link href="/saw">SAW</Link>
            </li>
            <li style={navItemStyle}>
              <Link href="/wp">WP</Link>
            </li>
            <li style={navItemStyle}>
              <Link href="/topsis">TOPSIS</Link>
            </li>
          </ul>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

const navStyle = {
  backgroundColor: "#000",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const navListStyle = {
  display: "flex",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const navItemStyle = {
  margin: "0 1rem",
  fontSize: "1.2rem",
};

// const mainStyle = {
//   margin: "2rem auto",
//   padding: "1rem",
//   maxWidth: "800px",
//   backgroundColor: "#fff",
//   borderRadius: "8px",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//   color: "#333",
// };
