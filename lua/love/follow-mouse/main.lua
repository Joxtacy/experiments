function love.load()
	--Create an object called circle
	circle = {}

	--Give it the properties x, y, radius and speed
	circle.x = 100
	circle.y = 100
	circle.radius = 25
	circle.speed = 200
end

function love.update(dt)
	--love.mouse.getPosition returns the x and y position of the cursor.

	mouse_x, mouse_y = love.mouse.getPosition()

	angle = math.atan2(mouse_y - circle.y, mouse_x - circle.x)
	cos = math.cos(angle)
	sin = math.sin(angle)

	local distance = getDistance(circle.x, circle.y, mouse_x, mouse_y)

	if distance < 400 then
		--Make the circle move towards the mouse
		circle.x = circle.x + circle.speed * cos * (distance / 100) * dt
		circle.y = circle.y + circle.speed * sin * (distance / 100) * dt
	end
end

function love.draw()
	love.graphics.circle("line", circle.x, circle.y, circle.radius)

	--The angle
	-- love.graphics.line(circle.x, circle.y, mouse_x, mouse_y)
	-- love.graphics.line(circle.x, circle.y, mouse_x, circle.y)
	-- love.graphics.line(circle.x, circle.y, circle.x, mouse_y)

	love.graphics.line(circle.x, circle.y, mouse_x, mouse_y)
	love.graphics.line(circle.x, circle.y, mouse_x, circle.y)
	love.graphics.line(mouse_x, mouse_y, mouse_x, circle.y)

	local distance = getDistance(circle.x, circle.y, mouse_x, mouse_y)
	love.graphics.circle("line", circle.x, circle.y, distance)
end

function getDistance(x1, y1, x2, y2)
	local horizontal_distance = x1 - x2
	local vertical_distance = y1 - y2
	--Both of these work
	local a = horizontal_distance * horizontal_distance
	local b = vertical_distance ^ 2

	local c = a + b
	local distance = math.sqrt(c)
	return distance
end
