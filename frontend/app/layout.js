import './globals.css'
import Navbar from './components/Navbar'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="pt-16">
        <Navbar />
        {children}
      </body>
    </html>
  )
}