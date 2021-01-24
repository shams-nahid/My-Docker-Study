## Docker Container

### How OS runs on machine?

---

**Kernel :** Most OS has a kernel. It runs the software process that govern the access between all the programs running on the computer and all the physical hardware connected to the computer.

For example, If we write a file in physical hard-disk using node.js, it's not node.js that speaking directly to the physical device. Actually node.js make a system call with necessary information to the kernel and the kernel persist the file in the physical storage.

So the kernel is an intermediary layer that govern the access between the program and physical devices.

**System Call :** The way program pass instruction to the kernel is called system call. These system call are very much like function invocation. The kernel exposes different endpoint as system call and program uses these system call.

For example to write a file, the kernel expose an endpoint as system call. Program like node.js invoke that system call with necessary information.

**A Chaos Scenario :** Lets consider a situation, where there are two program that require two types of node.js runtime.

- Program 01 (Require Node.js 8.0)
- Program 02 (Require Node.js 12.0)

If we can not install these 2 version of runtime, only one program can work at a time.

**Namespace :** OS has a feature to use namespace. Using namespace, we can segment hard-disk in two part. One segment will contain node.js runtime version of 8.0 and another segment will contain node.js runtime version 12.0

In this way, we can ensure the `program 01` will use the segment of node.js with 8.0 runtime and the `program 02` will use the segment of node.js 12.0 as runtime.

Here the kernel will determine the segment during system call by the programs. So for `program 01` the kernel drag the system call to segment with 8.0 node js and for `program 02` the kernel will drag the system call to segment with 12.0 node.js

> Selecting segment using system call based on the program is called namespacing. This allow isolating resource per processes or a group of processes.

Namespacing can be expanded for both cases

- Hardware Elements
  - Physical Storage Device
  - Network Devices
- Software Elements
  - Inter process communications
  - Observer and use of processes

**Control Group :** Also known as `cgroup`. This limits the amount of resources that a particular process can use. For example it determine,

- Amount of memory can be used by a process
- Number of I/O can be used by a process
- How much CPU a process can use
- How much Network bandwidth can a process use

**Namespacing Vs cgroup :** `Namespacing` allow o restrict using a resource. While the `cgroup` restrict the amount of resource a process can use.

### The Docker Container

---

Docker container is a group of

- Process or Group of processes
- Kernel
- Isolated resource

In a `container` kernel observe the system call and for the process, direct to the specified `isolated resources`.

> The windows and Mac OS does not have the feature of `namespacing` and `cgroup`. Whe we install docker in these machine, a linux virtual machine is installed to handle the isolation of resources of the process.

**Relation Between Image and Container :** An image have the following components

- File System snapshot
- Startup commands

When we take an image and turn it into a container, the kernel isolated the specified resource just for the container. Then the process or file system snapshot takes places in the physical storage.

While we run the startup commands, it installed these process from the physical storage and start making the `system call` using the `kernel`.
