export default function ({ route, redirect }) {
    // Contoh middleware: Redirect dari /old-path ke /new-path
    if (route.path === '/old-path') {
      redirect('/new-path');
    }
  }