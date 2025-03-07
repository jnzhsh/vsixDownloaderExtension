// 监听DOM变化确保版本历史表加载完成
const observer = new MutationObserver(() => {
  const versionTable = document.querySelector('table[aria-label="Version History Table"]');
  //console.log(versionTable);
  if (versionTable) {
    processVersionTable(versionTable);
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function processVersionTable(table) {
  // 从页面URL解析itemName
  const urlParams = new URLSearchParams(window.location.search);
  const itemName = urlParams.get('itemName') || 
    document.querySelector('meta[name="vsixItemName"]')?.content;
  
  if (!itemName) return;

  // 拆分itemName为两部分
  const [fieldA, fieldB] = itemName.split('.');
  
  // 遍历表格行处理版本号
  table.querySelectorAll('tbody tr').forEach(row => {
    //console.log(row);
    const versionCell = row.querySelector('td:nth-child(1)');
    const version = versionCell?.textContent?.trim();
    
    if (version && version.match(/\d+\.\d+\.\d+/)) {
      const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${fieldA}/vsextensions/${fieldB}/${version}/vspackage`;
      
      versionCell.innerHTML = `
        <a href="${downloadUrl}" 
           style="color: #0078d4; text-decoration: underline;"
           download
           title="直接下载VSIX">
          ${version}
        </a>
      `;
    }
  });
}