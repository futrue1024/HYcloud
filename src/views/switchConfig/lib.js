export const lib = {
  'datacenter':
    [
      { title: 'id', dataIndex: 'id', width: '50%' },
      { title: '名称', dataIndex: 'name', width: '50%' }
    ],
  'datastore':
    [
      { title: 'freeSpaceGB', dataIndex: 'freeSpaceGB' },
      { title: 'capacityGB', dataIndex: 'capacityGB' },
      { title: 'type', dataIndex: 'type' },
      { title: 'state', dataIndex: 'state' }
    ],
  'cluster':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' },
      { title: 'vsanEnabled', dataIndex: 'vsanEnabled' },
      { title: 'drsEnabled', dataIndex: 'drsEnabled' },
      { title: 'drsMode', dataIndex: 'drsMode' },
      { title: 'haEnabled', dataIndex: 'haEnabled' }
    ],
  'host':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' },
      { title: 'state', dataIndex: 'state' },
      { title: 'powerState', dataIndex: 'powerState' },
      { title: 'numCpu', dataIndex: 'numCpu' },
      { title: 'memoryTotalGB', dataIndex: 'memoryTotalGB' },
      { title: 'memoryUsageGB', dataIndex: 'memoryUsageGB' },
      { title: 'version', dataIndex: 'versions' }
    ],
  'vm':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' },
      { title: 'powerState', dataIndex: 'powerState' },
      { title: 'numCpu', dataIndex: 'numCpu' },
      { title: 'memoryGB', dataIndex: 'memoryGB' },
      { title: 'vmHostId', dataIndex: 'vmHostId' },
      { title: 'usedSpaceGB', dataIndex: 'usedSpaceGB' },
      { title: 'provisionedSpaceGB', dataIndex: 'provisionedSpaceGB' },
      { title: 'guestId', dataIndex: 'guestId' }
    ],
  'vdswitch':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' },
      { title: 'version', dataIndex: 'version' }
    ],
  'vdportgroup':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' },
      { title: 'vdSwitchId', dataIndex: 'vdSwitchId' }
    ],
  'oscustomizationspec':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' }
    ],
  'template':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' }
    ],
  'vdport':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'switchId', dataIndex: 'switchId' }
    ],
  'harddisk':
    [
      { title: 'id', dataIndex: 'id' },
      { title: 'name', dataIndex: 'name' },
      { title: 'capacityGB', dataIndex: 'capacityGB' }
    ]
}
export const tags = [
  { tagName: 'datacenter', webApi: '/Info/datacenter' },
  { tagName: 'datastore', webApi: '/Info/datastore' },
  { tagName: 'cluster', webApi: '/Info/cluster' },
  { tagName: 'host', webApi: '/Info/host' },
  { tagName: 'vm', webApi: '/Info/vm' },
  { tagName: 'vdswitch', webApi: '/Info/vdswitch' },
  { tagName: 'vdportgroup', webApi: '/Info/vdportgroup' },
  { tagName: 'oscustomizationspec', webApi: '/Info/oscustomizationspec' },
  { tagName: 'template', webApi: '/Info/template' },
  { tagName: 'vdport', webApi: '/Info/vdport' },
  { tagName: 'harddisk', webApi: '/Info/harddisk' }
]
