import re

# Fix admin dashboard page
with open('src/app/admin/dashboard/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The issue: the closing </div> for the outer div is missing
# Current structure: <div className="min-h-screen ..."> ... </div> (inner grid)   ); }
# Should be: <div className="min-h-screen ..."> ... </div>   ); }

# Find where the return statement ends and add missing closing div
# Pattern: The grid div closes, then there's ");" then "}"
# We need to add </div> before ");"

content = content.replace(
    '      </div>\n  );\n}',
    '      </div>\n    </div>\n  );\n}'
)

with open('src/app/admin/dashboard/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Dashboard fixed')

# Fix register page
with open('src/app/register/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Same issue - missing closing </div> for outer wrapper
content = content.replace(
    '      </div>\n    </div>\n  );\n}',
    '      </div>\n      </div>\n    </div>\n  );\n}'
)

with open('src/app/register/page.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Register fixed')

# Fix home page  
with open('src/app/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check for similar issues
lines = content.split('\n')
print('Home page lines:', len(lines))
for i, line in enumerate(lines[-10:], len(lines)-9):
    print(f'  {i}: {repr(line)}')
