const fs = require('fs');

const cd = '<';
const cd2 = '/';
const closeDiv = cd + cd2 + 'div>';
const closeDiv2 = cd + cd2 + 'div>';

const content = [
  '"use client";',
  '',
  'import { useEffect } from "react";',
  'import { useRouter } from "next/navigation";',
  'import { useAuth } from "@/lib/AuthContext";',
  '',
  'export default function Home() {',
  '  const { user, loading } = useAuth();',
  '  const router = useRouter();',
  '',
  '  useEffect(() => {',
  '    if (!loading) {',
  '      if (user) {',
  '        router.push("/dashboard");',
  '      } else {',
  '        router.push("/login");',
  '      }',
  '    }',
  '  }, [user, loading, router]);',
  '',
  '  return (',
  '    <div className="flex min-h-screen items-center justify-center bg-bg-primary">',
  '      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent">' + closeDiv,
  '    ' + closeDiv2,
  '  );',
  '}',
  ''
].join('\n');

fs.writeFileSync('src/app/page.js', content, 'utf8');
console.log('File written successfully!');
