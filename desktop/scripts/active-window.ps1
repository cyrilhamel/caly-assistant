Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win32 {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
}
"@
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
while ($true) {
  try {
    $h = [Win32]::GetForegroundWindow()
    $sb = New-Object System.Text.StringBuilder 512
    [void][Win32]::GetWindowText($h, $sb, 512)
    $procId = 0
    [void][Win32]::GetWindowThreadProcessId($h, [ref]$procId)
    $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
    $o = @{ process = if ($p) { $p.ProcessName } else { '' }; title = $sb.ToString() }
    Write-Output ($o | ConvertTo-Json -Compress)
  } catch {}
  Start-Sleep -Seconds 5
}
