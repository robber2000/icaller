const execa = require('execa');
try {
  execa.sync('wscript', ['C:\\Users\\Chen\\Desktop\\Windows\\aa.vbs', '张三']);
} catch (error) {
  console.log(error);
  /*
  {
      message: 'Command failed with ENOENT: unknown command spawnSync unknown ENOENT',
      errno: -2,
      code: 'ENOENT',
      syscall: 'spawnSync unknown',
      path: 'unknown',
      spawnargs: ['command'],
      originalMessage: 'spawnSync unknown ENOENT',
      shortMessage: 'Command failed with ENOENT: unknown command spawnSync unknown ENOENT',
      command: 'unknown command',
      stdout: '',
      stderr: '',
      all: '',
      failed: true,
      timedOut: false,
      isCanceled: false,
      killed: false
  }
  */
}