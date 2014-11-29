data = open('philosophicalinvestigations.txt').read().split('\n')
outdata = open('pi_yumlme.txt','w')
for line in data:
    if line.startswith('[') and line.endswith(','):
        outdata.write(line+'\n')
    else:
        if line:
            a, b = line.split(' ')
            if ('[' in a) and not ('[' in b):
                outdata.write('%s->[%s],\n'%(a,b))
            elif '[' in b and not ('[' in a):
                outdata.write('[%s]->[%s],\n'%(a,b))
            elif ('[' in a) and ('[' in b):
                outdata.write('%s->%s,\n'%(a,b))
            else:
                outdata.write('[%s]->[%s],\n' %(a,b))

outdata.close()
