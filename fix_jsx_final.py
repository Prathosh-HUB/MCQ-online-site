#!/usr/bin/env python3
"""Fix JSX structure in generated page files by ensuring proper nesting."""

import re

FILES = {
    'src/app/admin/dashboard/page.js': {
        'expected_end': '''        </Link>
      </div>
  );
}
'''
    },
    'src/app/register/page.js': {
        'expected_end': '''            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign In</Link>
          </p>
        </div>
    </div>
  );
}
'''
    },
    'src/app/page.js': {
        'expected_end': '''              <Link href="/login" className="px-8 py-3.5 text-base font-medium text-slate-300 border border-slate-600 hover:border-slate-500 rounded-xl transition-all">Sign In</Link>
            </div>
        </main>
        <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-800">
          <p>MCQ Interview - Built with Next.js & Prisma</p>
        </footer>
      </div>
  );
}
'''
    }
}

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    print(f"\n=== {filepath} ===")
    print(f"Lines: {len(lines)}")
    
    # Print last 10 lines
    for i in range(max(0, len(lines)-10), len(lines)):
        print(f"  {i+1}: {repr(lines[i])}")
    
    # Check if the file ends with proper '  );\n}'
    last_non_empty = ''
    for line in reversed(lines):
        if line.strip():
            last_non_empty = line.strip()
            break
    
    print(f"Last non-empty line: {repr(last_non_empty)}")
    
    # Check closing div balance
    open_divs = 0
    close_divs = 0
    for line in lines:
        open_divs += line.count('<div') - line.count('</div>') if '<div' in line else 0
        # Count self-closing divs (they don't count)
        open_divs -= line.count('/>') if '<div' in line and '/>' in line else 0
        close_divs += line.count('</div>')
    
    print(f"Open <div> tags: {open_divs}")
    print(f"Close </div> tags: {close_divs}")
    
    # Simple approach: count <div> openings vs </div> closings
    div_open_count = content.count('<div ')
    div_close_count = content.count('</div>')
    print(f"<div count: {div_open_count}, </div> count: {div_close_count}")
    
    # Fix: add missing closing divs
    if div_open_count > div_close_count:
        missing = div_open_count - div_close_count
        print(f"Missing {missing} closing div(s)")
        
        # Find where ); is and add </div> before it
        # Look for the pattern: last few lines before the final ();
        insert_pos = content.rfind('\n  );\n')
        if insert_pos == -1:
            insert_pos = content.rfind('\n  )')
        
        if insert_pos > 0:
            # Add missing </div> tags before the closing parenthesis
            prefix = content[:insert_pos]
            suffix = content[insert_pos:]
            extra_divs = '\n    </div>' * missing
            fixed = prefix + extra_divs + suffix
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed)
            print(f"Fixed! Added {missing} closing div(s)")
        else:
            print("Could not find ); pattern")

if __name__ == '__main__':
    for fp in FILES:
        fix_file(fp)
    print("\nDone!")
