# Transforming geodata from physical coordinates to earth centered earth fixed(ECEF)
# then to orthographic in 2D
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

# Move Hawaii and Alaska closer to Mainland, also shrink Alaska
indexes = []
for poly in geodata.locations['HI'].paths
  for i in poly
    if i not in indexes
      indexes.push(i)
for i in indexes
  [lat, lon] = geodata.points[i]
  geodata.points[i] = [lat+5, lon+50]

indexes = []
for poly in geodata.locations['AK'].paths
  for i in poly
    if i not in indexes
      indexes.push(i)
[minX, minY, maxX, maxY] = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE]
for i in indexes
  [lat, lon] = geodata.points[i]
  if lon < 0
    [minX, minY, maxX, maxY] = [Math.min(minX,lon), Math.min(minY,lat), Math.max(maxX,lon), Math.max(maxY,lat)]
[centerX, centerY] = [(minX+maxX)/2, (minY+maxY)/2]
for i in indexes
  [lat, lon] = geodata.points[i]
  if lon > 0
    lon = lon - 360
  dlon = Math.abs(lon-centerX)*12/17
  dlat = Math.abs(lat-centerY)*9/17
  if lat > centerY
    lat = lat-dlat
  else
    lat = lat+dlat
  if lon > centerX
    lon = lon-dlon
  else
    lon = lon+dlon
  if lon < -180
    lon = lon+360
  geodata.points[i] = [lat-35, lon-10]


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

# Constants
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
NAMES = {"FL": "Florida", "cen4": "West North Central", "hhs9": "HHS Region 9", "MT": "Montana", "WV": "West Virginia", "RI": "Rhode Island", "AR": "Arkansas", "VA": "Virginia", "cen7": "West South Central", "IN": "Indiana", "NC": "North Carolina", "IA": "Iowa", "MN": "Minnesota", "cen2": "Middle Atlantic", "DE": "Delaware", "PA": "Pennsylvania", "hhs7": "HHS Region 7", "nat": "US National", "hhs10": "HHS Region 10", "LA": "Louisiana", "MD": "Maryland", "AK": "Alaska", "CO": "Colorado", "WI": "Wisconsin", "ID": "Idaho", "OK": "Oklahoma", "hhs3": "HHS Region 3", "hhs2": "HHS Region 2", "hhs1": "HHS Region 1", "cen1": "New England", "KY": "Kentucky", "ME": "Maine", "CA": "California", "cen5": "South Atlantic", "WY": "Wyoming", "ND": "North Dakota", "NY": "New York", "MA": "Massachusetts", "UT": "Utah", "DC": "District of Columbia", "MS": "Mississippi", "hhs6": "HHS Region 6", "GA": "Georgia", "AL": "Alabama", "HI": "Hawaii", "hhs4": "HHS Region 4", "AZ": "Arizona", "CT": "Connecticut", "KS": "Kansas", "NH": "New Hampshire", "cen8": "Mountain", "TX": "Texas", "NV": "Nevada", "TN": "Tennessee", "NJ": "New Jersey", "MI": "Michigan", "hhs8": "HHS Region 8", "NM": "New Mexico", "IL": "Illinois", "cen3": "East North Central", "VT": "Vermont", "WA": "Washington", "SD": "South Dakota", "NE": "Nebraska", "hhs5": "HHS Region 5", "SC": "South Carolina", "cen6": "East South Central", "OR": "Oregon", "cen9": "Pacific", "MO": "Missouri", "OH": "Ohio"}
REGION2STATE = {"hhs1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'], "hhs2": ['NY', 'NJ'], "hhs3": ['PA', 'DE', 'DC', 'MD', 'VA', 'WV'], "hhs4": ['NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'MS', 'AL'], "hhs5": ['MI', 'IL', 'IN', 'OH', 'WI', 'MN'], "hhs6": ['LA', 'AR', 'OK', 'TX', 'NM'], "hhs7": ['IA', 'MO', 'NE', 'KS'], "hhs8": ['ND', 'SD', 'CO', 'WY', 'MT', 'UT'], "hhs9": ['NV', 'CA', 'HI', 'AZ'], "hhs10": ['WA', 'OR', 'AK', 'ID'], "cen1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'], "cen2": ['PA', 'NY', 'NJ'], "cen3": ['WI', 'MI', 'IN', 'IL', 'OH'], "cen4": ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO'], "cen5": ['DE','MD','DC','WV','VA','NC','SC','GA','FL'], "cen6": ['KY','TN', 'MS', 'AL'], "cen7": ['OK', 'AR', 'LA', 'TX'], "cen8": ['MT', 'ID', 'WY', 'CO', 'UT', 'NV', 'AZ', 'NM'], "cen9": ['WA', 'OR', 'CA', 'AK', 'HI']}


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
    @dataTimeline = $("#dataTimeline")
    @canvasMap = $('#canvas_map')
    @canvasMap.mousemove((e) => 
      loc = @hitTest(e.offsetX, e.offsetY)
      if loc? and loc != 'AK' and loc != 'HI'
        $('#canvas_map').css('cursor','pointer')
        @renderMap()
        ctx = @canvasMap[0].getContext('2d')
        ctx.font = 12 + 'px sans-serif'
        ctx.fillStyle = '#eee'
        ctx.fillText(loc, e.offsetX, e.offsetY)
      else
        $('#canvas_map').css('cursor','auto')
        @renderMap())
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
      @dataTimeline.html("Data of week " + epiweek1 + " to week " + epiweek2);
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
    @renderMapList()
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

  renderMapList: () ->
    $('#map_list ul').empty()
    saveThis = @
    for loc in @locations
      $('#map_list ul').append(
        $('<li>').attr('class','map_list_element').attr('id', 'map_list_element_'+loc).append(
          $('<a>').attr('href','#').append(NAMES[loc])));
    for loc in @locations
      $('#map_list_element_'+loc).hover(
        (ev) -> saveThis.renderMap(this.id.substring(17))
        (ev) -> saveThis.renderMap())

  renderMap: (highlight=null) ->
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
      if loc != highlight
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
    # Highlight the hovered region(decompose states as well)
    if highlight?
      ctx.font = 12 + 'px sans-serif'
      ctx.strokeStyle = '#eee'
      if highlight of REGION2STATE
        ctx.lineWidth = 0.5
        for loc in REGION2STATE[highlight]
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
        ctx.lineWidth = 1.5
        for poly in geodata.locations[highlight].paths
          ctx.beginPath()
          ln = 0
          for idx in poly
            line[ln](@ecef2ortho(geodata.points[idx]...)...)
            ln |= 1
          ctx.closePath()
          ctx.stroke()
        for loc in REGION2STATE[highlight]
          ctx.fillStyle = '#eee'
          [cX, cY] = @locCenterOnMap(loc)
          ctx.fillText(loc, cX, cY)
      else
        ctx.lineWidth = 1.5
        for poly in geodata.locations[highlight].paths
          ctx.beginPath()
          ln = 0
          for idx in poly
            line[ln](@ecef2ortho(geodata.points[idx]...)...)
            ln |= 1
          ctx.closePath()
          ctx.fillStyle = @colors?[loc] ? '#ccc'
          ctx.fill()
          ctx.stroke()
        ctx.fillStyle = '#eee'
        [cX, cY] = @locCenterOnMap(highlight)
        ctx.fillText(highlight, cX, cY)
    # Draw AK and HI seperately
    if highlight != 'AK'
      [cX, cY] = @locCenterOnMap('AK')
      ctx.font = 12 + 'px sans-serif'
      ctx.fillStyle = '#eee'
      ctx.fillText('AK', cX, cY)
    if highlight != 'HI'
      [cX, cY] = @locCenterOnMap('HI')
      ctx.font = 12 + 'px sans-serif'
      ctx.fillStyle = '#eee'
      ctx.fillText('HI', cX, cY)
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
    # x-ticks (only for weeks 20 and 40)
    for i in (i for i in [0...numWeeks - 10]).concat([numWeeks - 1])
      wk = (@chartData[i].epiweek % 100)
      if wk == 20 or wk == 40
        x = i2x(i)
        trace([x, x], [h - padding.bottom, h - (padding.bottom - 6)])
        yr = (Math.round(@chartData[i].epiweek / 100) % 100)
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

  locCenterOnMap: (loc) ->
    [centerX, centerY, k] = [0, 0, 0]
    for poly in geodata.locations[loc].paths
      for idx in [1..poly.length]
        [x, y] = @ecef2ortho(geodata.points[poly[idx % poly.length]]...)
        [centerX, centerY] = [centerX + x, centerY + y]
        k++
    [centerX, centerY] = [centerX/k, centerY/k]
    if loc == 'AK'
      centerY = centerY - 10
    return [centerX, centerY]

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
