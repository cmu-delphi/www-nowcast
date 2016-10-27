deg2rad = Math.PI / 180

ll2ecef = (lat, lon, h=0) ->
  [lat, lon] = [lat * deg2rad, lon  * deg2rad]
  [clat, clon] = [Math.cos(lat), Math.cos(lon)]
  [slat, slon] = [Math.sin(lat), Math.sin(lon)]
  [a, f] = [6378137, 298.257223563 ** -1]
  C = (clat ** 2 + ((1 - f) * slat) ** 2) ** -0.5
  S = (1 - f) ** 2 * C
  H = h / a
  x = (C + H) * clat * clon
  y = (C + H) * clat * slon
  z = (S + H) * slat
  return [x, y, z]

get_ecef2ortho = (lat, lon, zoom, w, h) ->
  [dx, dy] = [lat * deg2rad, lon * deg2rad]
  [sx, cx] = [Math.sin(dx), Math.cos(dx)]
  [sy, cy] = [Math.sin(dy), Math.cos(dy)]
  [w2, h2] = [w / 2, h / 2]
  wh = Math.min(w2, h2) * zoom
  [a, b, d, e, f] = [-sy * wh, cy * wh, cy * sx * wh, sx * sy * wh, -cx * wh]
  return (x, y, z) -> [w2 + x * a + y * b, h2 + x * d + y * e + z * f]

#Pre-process geodata

# Move Hawaii and Alaska closer to Mainland, also shrink Alaska
indexes = []
for poly in geodata.locations['HI'].paths
  for i in poly
    if i not in indexes
      indexes.push(i)
for i in indexes
  [lat, lon] = geodata.points[i]
  geodata.points[i] = [lat+20, lon+20]

indexes = []
for poly in geodata.locations['AK'].paths
  for i in poly
    if i not in indexes
      indexes.push(i)
[minX, minY, maxX, maxY] = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE]
for i in indexes
  [lat, lon] = geodata.points[i]
  [newlat, newlon] = [lat-10, lon-62]
  geodata.points[i] = [newlat, newlon]
  [minX, minY, maxX, maxY] = [Math.min(minX,newlon), Math.min(minY,newlat), Math.max(maxX,newlon), Math.max(maxY,newlat)]
[centerX, centerY] = [(minX+maxX)/2, (minY+maxY)/2]
for i in indexes
  [lat, lon] = geodata.points[i]
  [newlat, newlon] = [(centerY+lat)/2, (centerX+lon)/2]
  geodata.points[i] = [newlat, newlon]



for i in [0...geodata.points.length]
  [lat, lon] = geodata.points[i]
  geodata.points[i] = ll2ecef(lat, lon)
  if lon >= 0
    lon -= 360
  if i == 0
    [x1, x2, y1, y2] = [lon, lon, lat, lat]
  [y1, y2] = [Math.min(y1, lat), Math.max(y2, lat)]
  [x1, x2] = [Math.min(x1, lon), Math.max(x2, lon)]
[LON_MIN, LON_MAX, LAT_MIN, LAT_MAX] = [x1, x2, y1, y2]

NATIONAL = [
  'nat'
]
HHS_REGIONS = [
  'hhs1', 'hhs2', 'hhs3', 'hhs4', 'hhs5', 'hhs6', 'hhs7', 'hhs8', 'hhs9', 'hhs10'
]
CENSUS_REGIONS = [
  'cen1', 'cen2', 'cen3', 'cen4', 'cen5', 'cen6', 'cen7', 'cen8', 'cen9'
]
REGIONS = HHS_REGIONS.concat(CENSUS_REGIONS)
STATES = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
]
LOCATIONS = NATIONAL.concat(REGIONS).concat(STATES)

ILI_SHARED = [
  # select state, count(1) from fluview_state group by state order by state
  'AK', 'AZ', 'CA', 'CO', 'ID', 'KS', 'LA', 'MD', 'ME', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'OH', 'OR', 'PA', 'RI', 'TN', 'TX', 'VA', 'VI', 'VT', 'WI', 'WV', 'WY'
]
ILI_AVAILABLE = [
  # select state, count(1) from state_ili group by state order by state
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'IA', 'ID', 'IL', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'RI', 'SC', 'SD', 'TN', 'TX', 'VT', 'WI', 'WV', 'WY'
]
NAMES = {"FL": "Florida", "cen4": "Census Region 4", "hhs9": "HHS Region 9", "MT": "Montana", "WV": "West Virginia", "RI": "Rhode Island", "AR": "Arkansas", "VA": "Virginia", "cen7": "Census Region 7", "IN": "Indiana", "NC": "North Carolina", "IA": "Iowa", "MN": "Minnesota", "cen2": "Census Region 2", "DE": "Delaware", "PA": "Pennsylvania", "hhs7": "HHS Region 7", "nat": "US National", "hhs10": "HHS Region 10", "LA": "Louisiana", "MD": "Maryland", "AK": "Alaska", "CO": "Colorado", "WI": "Wisconsin", "ID": "Idaho", "OK": "Oklahoma", "hhs3": "HHS Region 3", "hhs2": "HHS Region 2", "hhs1": "HHS Region 1", "cen1": "Census Region 1", "KY": "Kentucky", "ME": "Maine", "CA": "California", "cen5": "Census Region 5", "WY": "Wyoming", "ND": "North Dakota", "NY": "New York", "MA": "Massachusetts", "UT": "Utah", "DC": "District of Columbia", "MS": "Mississippi", "hhs6": "HHS Region 6", "GA": "Georgia", "AL": "Alabama", "HI": "Hawaii", "hhs4": "HHS Region 4", "AZ": "Arizona", "CT": "Connecticut", "KS": "Kansas", "NH": "New Hampshire", "cen8": "Census Region 8", "TX": "Texas", "NV": "Nevada", "TN": "Tennessee", "NJ": "New Jersey", "MI": "Michigan", "hhs8": "HHS Region 8", "NM": "New Mexico", "IL": "Illinois", "cen3": "Census Region 3", "VT": "Vermont", "WA": "Washington", "SD": "South Dakota", "NE": "Nebraska", "hhs5": "HHS Region 5", "SC": "South Carolina", "cen6": "Census Region 6", "OR": "Oregon", "cen9": "Census Region 9", "MO": "Missouri", "OH": "Ohio"}


getFakeRow = (location, i) ->
  'location': location
  'epiweek': 201201 + 100 * Math.floor(i / 52) + i % 52
  'value': 1 + Math.random() * 3
  'std': 0.5 + Math.random() * 1

getEpidataHander = (callback) ->
  return (result, message, epidata) ->
    if result == 1
      callback(epidata)
    else
      msg = "The Epidata API says '#{message}'. (error ##{result})"
      console.log(msg)
      alert.log(msg)

Epidata_nowcast_single = (handler, location) ->
  if Epidata?.nowcast?
    Epidata.nowcast(handler, location, '201130-202030')
  else
    fakeData = (getFakeRow(location, i) for i in [0...280])
    callback = () -> handler(1, 'debug', fakeData)
    delay = 250 + Math.round(Math.random() * 500)
    window.setTimeout(callback, delay)

Epidata_nowcast_multi = (handler, locations, epiweek1, epiweek2) ->
  if Epidata?.nowcast?
    Epidata.nowcast(handler, locations, Epidata.range(epiweek1, epiweek2))
  else
    fakeData = []
    for i in [0...3]
      for loc in locations
        row = getFakeRow(loc, i)
        if i == 0
          row.epiweek = epiweek2
        fakeData.push(row)
    callback = () -> handler(1, 'debug', fakeData)
    delay = 250 + Math.round(Math.random() * 500)
    window.setTimeout(callback, delay)


class PointerInput

  THRESHOLD = 5

  constructor: (@elem, @listener) ->
    @elem.on('mousedown touchstart', (e) => @onDown(e))
    @elem.on('mouseup touchend', (e) => @onUp(e))
    @elem.on('mousemove touchmove', (e) => @onMove(e))
    @elem.on('mouseleave touchleave', (e) => @onLeave(e))
    @elem.on('wheel', (e) => @onWheel(e))

  _get_xyt: (e) ->
    if e.touches?.length > 0
      touch = e.touches.item(0)
      offset = @elem.offset()
      return [touch.pageX - offset.left, touch.pageY - offset.top, +new Date()]
    else
      return [e.offsetX, e.offsetY, +new Date()]

  onDown: (e) ->
    @last = @down = @_get_xyt(e)

  onUp: (e) ->
    if not @down? then return
    [x1, y1, t1] = @down
    [x2, y2, t2] = @_get_xyt(e)
    @down = null
    if ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5 < THRESHOLD
      @listener.onClick((x1 + x2) / 2, (y1 + y2) / 2)

  onMove: (e) ->
    if not @down? then return
    e.preventDefault()
    @curr = @_get_xyt(e)
    [x1, y1, t1] = @last
    [x2, y2, t2] = @curr
    @last = @curr
    @listener.onDrag(x2, y2, x2 - x1, y2 - y1)

  onLeave: (e) ->
    @down = null

  onWheel: (e) ->
    @listener.onScroll(e.originalEvent.deltaY)


window.App = class App

  PAGE_MAP = 0
  PAGE_CHART = 1

  constructor: () ->
    clicker = (name, locations) =>
      return () =>
        $('.button_group0 i').removeClass('fa-dot-circle-o')
        $('.button_group0 i').addClass('fa-circle-o')
        $("#button_view_#{name} i").removeClass('fa-circle-o')
        $("#button_view_#{name} i").addClass('fa-dot-circle-o')
        @setLocations(locations)
    $('#button_view_nat').click(clicker('nat', NATIONAL))
    $('#button_view_hhs').click(clicker('hhs', HHS_REGIONS))
    $('#button_view_cen').click(clicker('cen', CENSUS_REGIONS))
    $('#button_view_sta').click(clicker('sta', STATES))
    $('#button_zoom_in').click(() => @zoomIn())
    $('#button_zoom_out').click(() => @zoomOut())
    @canvasMap = $('#canvas_map')
    @canvasMap.mousemove((e) => 
      loc = @hitTest(e.offsetX, e.offsetY)
      if loc?
        $('#canvas_map').css('cursor','pointer')
      else
        $('#canvas_map').css('cursor','auto'))
    @canvasChart = $('#canvas_chart')
    $(window).resize(() => @resizeCanvas())
    @pointerInput = new PointerInput(@canvasMap, @)
    @canvasMap.focus()
    @currentPage = PAGE_MAP
    @setLocations(STATES)
    @resetView()
    @resizeCanvas()
    @loadEpidata()
    window.onpopstate = (e) => @backToHome()
    $('#back_arrow').click((e) -> window.history.back())

  loadEpidata: () ->
    callback = (epidata) =>
      epiweek1 = epidata[epidata.length - 4].epiweek
      epiweek2 = epidata[epidata.length - 1].epiweek
      callback = (epidata) =>
        @colors = {}
        for row in epidata
          if row.epiweek == epiweek2
            ili = row.value
            v = Math.max(0, Math.min(5, ili)) / 5
            c = ('0' + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2)
            @colors[row.location] = '#' + c + '4040'
        @renderMap()
      handler = getEpidataHander(callback)
      Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2)
    handler = getEpidataHander(callback)
    Epidata_nowcast_single(handler, 'nat')

  backToHome: () ->
    @currentPage = PAGE_MAP
    $('.pages').animate({left: '0%'}, 125)

  showLocationDetails: (loc) ->
    @currentPage = PAGE_CHART
    history.pushState({}, '')
    $('#location_name').html(NAMES[loc])
    $('.achievement_holder').hide()
    if loc.length > 2
      $('#location_link').show()
    else
      if loc.toUpperCase() in ILI_AVAILABLE
        $('#location_star1').show()
      else
        $('#location_star0').show()
      if loc.toUpperCase() in ILI_SHARED
        $('#location_heart1').show()
      else
        $('#location_heart0').show()
    $('.location_right').css('display', 'none')
    $('#loading_icon').css('display', 'flex')
    $('.pages').animate({left: '-100%'}, 125)
    @fetchNowcast(loc)

  setLocations: (@locations) ->
    @renderMap()

  resizeCanvas: () ->
    @canvasMap.attr('width', @canvasMap.width() + 'px')
    @canvasMap.attr('height', @canvasMap.height() + 'px')
    @canvasChart.attr('width', @canvasChart.width() + 'px')
    @canvasChart.attr('height', @canvasChart.height() + 'px')
    @renderMap()
    @renderChart()

  resetView: () ->
    @dlat = 51.7
    @dlon = -108.8
    @zoom = 2
    @renderMap()

  onClick: (x, y) ->
    loc = @hitTest(x, y)
    if loc?
      @showLocationDetails(loc)

  onDrag: (x, y, dx, dy) ->
    @dlon -= dx / (4 * @zoom)
    @dlat += dy / (4 * @zoom)
    @dlat = Math.max(Math.min(@dlat, LAT_MAX), LAT_MIN)
    @dlon = Math.max(Math.min(@dlon, LON_MAX), LON_MIN)
    @renderMap()

  onScroll: (delta) ->
    factor = 1 + Math.abs(delta) / 500
    if delta < 0
      @zoomIn(factor)
    else
      @zoomOut(factor)

  zoomIn: (factor=1.5) ->
    @zoom = Math.min(@zoom * factor, 500)
    @renderMap()

  zoomOut: (factor=1.5) ->
    @zoom = Math.max(@zoom / factor, 1.25)
    @renderMap()

  renderMap: () ->
    [w, h] = [@canvasMap.width(), @canvasMap.height()]
    ctx = @canvasMap[0].getContext('2d')
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    line = {
      0: (x, y) -> ctx.moveTo(x, y),
      1: (x, y) -> ctx.lineTo(x, y),
    }
    @ecef2ortho = get_ecef2ortho(@dlat, @dlon, @zoom, w, h)
    for loc in @locations
      #ctx.fillStyle = '#' + ('00000' + Math.floor(Math.random() * 0x1000000).toString(16)).slice(-6)
      for poly in geodata.locations[loc].paths
        ctx.beginPath()
        ln = 0
        for idx in poly
          line[ln](@ecef2ortho(geodata.points[idx]...)...)
          ln |= 1
        ctx.closePath()
        ctx.fillStyle = @colors?[loc] ? '#ccc'
        ctx.fill()
        ctx.stroke()
    return 0

  renderChart: () ->
    if not @chartData?
      return
    [w, h] = [@canvasChart.width(), @canvasChart.height()]
    ctx = @canvasChart[0].getContext('2d')
    ctx.fillStyle = '#ddd'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#000'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 0.005 * (w + h) / 2
    line = {
      0: (x, y) -> ctx.moveTo(x, y),
      1: (x, y) -> ctx.lineTo(x, y),
    }
    padding =
      left: 64
      right: 20
      top: 36
      bottom: 64
    bounds =
      width: w - padding.left - padding.right
      height: h - padding.top - padding.bottom
    numWeeks = @chartData.length
    for row in @chartData
      maxILI = Math.max(maxILI ? row.value, row.value)
    maxILI = Math.round(maxILI + 1)
    i2x = (i) -> padding.left + bounds.width * i / (numWeeks - 1)
    ili2y = (ili) -> padding.top + bounds.height * (1 - ili / maxILI)
    trace = (xx, yy) ->
      ln = 0
      ctx.beginPath()
      for _i in [0...xx.length]
        line[ln](xx[_i], yy[_i])
        ln |= 1
      ctx.stroke()
    write = (txt, x, y, angle) ->
      ht = ctx.measureText('W').width  # good enough
      wt = ctx.measureText(txt).width
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle * Math.PI * 2)
      ctx.translate(-wt / 2, +ht / 2)
      ctx.fillText(txt, 0, 0)
      ctx.restore()
    # ILI over time
    iVals = (i for i in [0...numWeeks])
    iliVals = (@chartData[i].value for i in [0...numWeeks])
    trace(iVals.map(i2x), iliVals.map(ili2y))
    # axes
    trace([0, numWeeks - 1].map(i2x), [0, 0].map(ili2y))
    trace([0, 0].map(i2x), [0, maxILI].map(ili2y))
    # axis labels
    ctx.font = '16px sans-serif'
    write('Time (weeks)', w / 2, h - padding.bottom / 3, 0)
    prefix = if @chartData[0].location.length > 2 then 'Weighted ' else ''
    write(prefix + '%ILI', padding.left / 3, h / 2, -0.25)
    ctx.font = '12px sans-serif'
    # y-ticks
    for ili in [0..maxILI]
      y = ili2y(ili)
      trace([padding.left - 6, padding.left], [y, y])
      if bounds.height / maxILI >= 32 or ili % 2 == 0
        write(ili, 3 * padding.left / 4, y, 0)
    # x-ticks
    for i in (i for i in [0...numWeeks - 10]).concat([numWeeks - 1])
      if i % 20 == 0 or i == numWeeks - 1
        x = i2x(i)
        trace([x, x], [h - padding.bottom, h - (padding.bottom - 6)])
        yr = (Math.round(@chartData[i].epiweek / 100) % 100)
        wk = (@chartData[i].epiweek % 100)
        yr = ('00' + yr).slice(-2)
        wk = ('00' + wk).slice(-2)
        write("'#{yr}w#{wk}", x, h - 2 * padding.bottom / 3, -0.125)
    # title
    ctx.font = 24 * Math.min(1, w / 500) + 'px sans-serif'
    name = NAMES[@chartData[0].location]
    write("Historial Nowcasts for #{name}", w / 2, padding.top / 2, 0)

  hitTest: (u, v) ->
    for loc in @locations
      for poly in geodata.locations[loc].paths
        hit = false
        [u1, v1] = @ecef2ortho(geodata.points[poly[0]]...)
        for idx in [1..poly.length]
          [u2, v2] = @ecef2ortho(geodata.points[poly[idx % poly.length]]...)
          if ((v1 > v) != (v2 > v)) and ((u1 > u) or (u2 > u)) and (((u1 > u) and (u2 > u)) or (u1 + (v - v1) * (u2 - u1) / (v2 - v1) > u))
            hit = !hit
          [u1, v1] = [u2, v2]
        if hit
          return loc
    return null

  fetchNowcast: (loc) ->
    @chartData = null
    callback = (epidata) => @onNowcastReceived(epidata)
    Epidata_nowcast_single(getEpidataHander(callback), loc)

  onNowcastReceived: (epidata) ->
    current = epidata[epidata.length - 1]
    ili = '' + (Math.round(current.value * 100) / 100)
    if '.' in ili
      ili += '00'
      idx = ili.indexOf('.')
      ili = ili.slice(0, idx + 3)
    else
      ili += '.00'
    loc = current.location
    epiweek = current.epiweek
    @chartData = epidata
    $('#nowcast_label').text("ILI nowcast for #{loc} as of #{epiweek}:")
    $('#nowcast_value').text("#{ili}%")
    $('#chart_label').text("Historical ILI nowcasts for #{loc}:")
    $('.location_right').css('display', 'block')
    $('#loading_icon').css('display', 'none')
    @resizeCanvas()
