import Joi from '../../utils/joi.js'

export const peersResource = {
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        verbose: Joi.boolean().default(false),
        direction: Joi.boolean().default(false),
        timeout: Joi.timeout()
      })
        .rename('v', 'verbose', {
          override: true,
          ignoreUndefined: true
        })
    }
  },
  /**
   * @param {import('../../types').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async handler (request, h) {
    const {
      app: {
        signal
      },
      server: {
        app: {
          ipfs
        }
      },
      query: {
        verbose,
        direction,
        timeout
      }
    } = request

    const peers = await ipfs.swarm.peers({
      verbose,
      signal,
      timeout
    })

    return h.response({
      Peers: peers.map((p) => {
        return {
          Peer: p.peer.toString(),
          Addr: p.addr.toString(),
          Direction: verbose || direction ? p.direction : undefined,
          Muxer: verbose ? p.muxer : undefined,
          Latency: verbose ? p.latency : undefined
        }
      })
    })
  }
}

export const addrsResource = {
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        timeout: Joi.timeout()
      })
    }
  },
  /**
   * @param {import('../../types').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async handler (request, h) {
    const {
      app: {
        signal
      },
      server: {
        app: {
          ipfs
        }
      },
      query: {
        timeout
      }
    } = request

    const peers = await ipfs.swarm.addrs({
      signal,
      timeout
    })

    return h.response({
      Addrs: peers.reduce((/** @type {Record<string, any>} */ addrs, peer) => {
        addrs[peer.id.toString()] = peer.addrs.map(a => a.toString())
        return addrs
      }, {})
    })
  }
}

export const localAddrsResource = {
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        timeout: Joi.timeout()
      })
    }
  },
  /**
   * @param {import('../../types').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async handler (request, h) {
    const {
      app: {
        signal
      },
      server: {
        app: {
          ipfs
        }
      },
      query: {
        timeout
      }
    } = request

    const addrs = await ipfs.swarm.localAddrs({
      signal,
      timeout
    })

    return h.response({
      Strings: addrs.map((addr) => addr.toString())
    })
  }
}

export const connectResource = {
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        addr: Joi.multiaddr().required(),
        timeout: Joi.timeout()
      })
        .rename('arg', 'addr', {
          override: true,
          ignoreUndefined: true
        })
    }
  },
  /**
   * @param {import('../../types').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async handler (request, h) {
    const {
      app: {
        signal
      },
      server: {
        app: {
          ipfs
        }
      },
      query: {
        addr,
        timeout
      }
    } = request

    await ipfs.swarm.connect(addr, {
      signal,
      timeout
    })

    return h.response({
      Strings: [`connect ${addr} success`]
    })
  }
}

export const disconnectResource = {
  options: {
    validate: {
      options: {
        allowUnknown: true,
        stripUnknown: true
      },
      query: Joi.object().keys({
        addr: Joi.multiaddr().required(),
        timeout: Joi.timeout()
      })
        .rename('arg', 'addr', {
          override: true,
          ignoreUndefined: true
        })
    }
  },
  /**
   * @param {import('../../types').Request} request
   * @param {import('@hapi/hapi').ResponseToolkit} h
   */
  async handler (request, h) {
    const {
      app: {
        signal
      },
      server: {
        app: {
          ipfs
        }
      },
      query: {
        addr,
        timeout
      }
    } = request

    await ipfs.swarm.disconnect(addr, {
      signal,
      timeout
    })

    return h.response({
      Strings: [`disconnect ${addr} success`]
    })
  }
}
